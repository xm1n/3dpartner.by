# Kubernetes — кластеризация и оркестрация 3D Partner

Развёртывание приложения в кластере Kubernetes: несколько реплик приложения, Postgres, Redis, MinIO, Ingress.

## Требования

- Kubernetes 1.28+
- Ingress Controller (например [nginx-ingress](https://kubernetes.github.io/ingress-nginx/deploy/))
- Реестр образов (для продакшена: свой registry или Docker Hub)

## Ошибка «connection refused» к localhost:8080

Если при `kubectl apply -f k8s/` появляется ошибка **dial tcp 127.0.0.1:8080: connection refused**, значит на этой машине **нет подключения к кластеру**: либо кластер не установлен, либо не настроен kubeconfig.

### Вариант A: Поднять кластер на сервере (k3s)

На сервере, где планируете запускать приложение (например `root@site`), можно за минуту поднять одноподный кластер [k3s](https://k3s.io/):

```bash
curl -sfL https://get.k3s.io | sh
# подождать ~30 сек, затем:
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes   # должен быть один node в Ready
```

Дальше ставите Ingress (k3s по умолчанию может уже включать Traefik; для nginx — см. [install nginx ingress](https://kubernetes.github.io/ingress-nginx/deploy/) для вашего окружения) и применяете манифесты: `kubectl apply -f k8s/`.

### Вариант B: Локальная разработка с k3d

[k3d](https://k3d.io/) поднимает k3s в Docker — удобно собирать и проверять проект локально. Быстрый старт:

```bash
# Установка k3d: https://k3d.io/#installation (brew install k3d / curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash)

# Создать кластер (порты 80/443 на loadbalancer)
k3d cluster create 3dpartner -p "80:80@loadbalancer" -p "443:443@loadbalancer"

# После этого kubeconfig подхватится автоматически
kubectl get nodes
```

Дальше: собрать образы, импортировать их в k3d, применить манифесты (см. раздел **[Сборка и деплой в k3d](#сборка-и-деплой-в-k3d)** ниже).

### Вариант C: Уже есть кластер в другом месте

Тогда на сервере `site` должен быть настроен доступ к нему:

- Либо скопировать на `site` файл kubeconfig с машины, где уже есть доступ к кластеру:
  ```bash
  scp user@cluster-server:~/.kube/config ~/.kube/config
  export KUBECONFIG=~/.kube/config
  ```
- Либо использовать облачный кластер (EKS, GKE, Yandex Cloud и т.д.) и установить их CLI + получить kubeconfig по инструкции провайдера.

Проверка: `kubectl cluster-info` и `kubectl get nodes` должны выполняться без ошибок. После этого `kubectl apply -f k8s/` применит манифесты в кластер.

## ErrImagePull / ImagePullBackOff

Если поды приложения в состоянии **ErrImagePull** или **ImagePullBackOff**, кластер не может скачать образ `3dpartner:latest`: без имени registry он ищется на Docker Hub и там его нет. Нужно сделать образ доступным на **той же ноде**, где крутится k3s, либо положить его в registry.

### Вариант A: Образ собран на той же машине, что и k3s

k3s использует containerd, а не Docker. Локальный образ из `docker build` нужно импортировать в containerd:

```bash
# На сервере с k3s, после docker build -t 3dpartner:latest .
docker save 3dpartner:latest | sudo k3s ctr images import -
# Перезапустить поды, чтобы подхватили образ
kubectl rollout restart deployment/app-3dpartner -n 3dpartner
```

### Вариант B: Образ в registry (Docker Hub, GHCR, свой)

Соберите и запушьте образ, в манифестах укажите полное имя образа:

```bash
docker build -t your-registry/3dpartner:latest .
docker push your-registry/3dpartner:latest
```

В `k8s/app.yaml` замените `image: 3dpartner:latest` на `image: your-registry/3dpartner:latest`. Для приватного registry добавьте в Deployment `imagePullSecrets` (Secret типа `kubernetes.io/dockerconfigjson`).

После правок: `kubectl apply -f k8s/app.yaml` и при необходимости `kubectl rollout restart deployment/app-3dpartner -n 3dpartner`.

## Сборка и деплой в k3d

Полный цикл: кластер → образы → секреты → манифесты → миграции → доступ.

**1. Создать кластер (если ещё нет)**

```bash
k3d cluster create 3dpartner -p "80:80@loadbalancer" -p "443:443@loadbalancer"
# или один скрипт на всё: chmod +x k8s/k3d-up.sh && ./k8s/k3d-up.sh
```

**2. Собрать образы и загрузить в кластер**

k3d подхватывает образы из локального Docker — не нужен push в registry.

```bash
docker build -t 3dpartner:latest .
docker build --target builder -t 3dpartner:migrate .

k3d image import 3dpartner:latest -c 3dpartner
k3d image import 3dpartner:migrate -c 3dpartner
```

**3. Секрет и манифесты**

```bash
cp k8s/secret.yaml.example k8s/secret.yaml
# Отредактировать k8s/secret.yaml: DATABASE_URL (хост postgres), PAYLOAD_SECRET, S3_*, REDIS_URL

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/minio.yaml
```

Дождаться готовности Postgres/MinIO: `kubectl get pods -n 3dpartner -w`.

**4. Миграции и приложение**

```bash
kubectl apply -f k8s/migrate-job.yaml -n 3dpartner
kubectl logs -f job/payload-migrate -n 3dpartner   # дождаться успешного завершения

kubectl apply -f k8s/app.yaml -n 3dpartner
kubectl apply -f k8s/ingress.yaml -n 3dpartner
```

В k3d по умолчанию стоит Traefik; в манифесте Ingress указан `ingressClassName: nginx`. Чтобы работал через Ingress, либо установите [nginx-ingress](https://kubernetes.github.io/ingress-nginx/deploy/) в кластер, либо временно замените в `k8s/ingress.yaml` класс на `traefik` или уберите строку `ingressClassName` (Traefik может взять Ingress без класса).

**5. Доступ к приложению**

- **Через port-forward (без Ingress):**  
  `kubectl port-forward -n 3dpartner svc/app-3dpartner 3000:80`  
  Открыть в браузере: http://localhost:3000

- **Через Ingress:**  
  Добавить в `/etc/hosts`: `127.0.0.1 3dpartner.by`  
  Открыть: http://3dpartner.by (порт 80 уже проброшен в k3d).

**Остановка и удаление кластера**

```bash
k3d cluster delete 3dpartner
# или: ./k8s/k3d-down.sh
```

## Порядок развёртывания

### 1. Создать Secret из примера

```bash
cp k8s/secret.yaml.example k8s/secret.yaml
# Отредактировать k8s/secret.yaml: пароли, PAYLOAD_SECRET, ключи MinIO
```

Поля в Secret:

- `POSTGRES_PASSWORD` — пароль пользователя Postgres (должен совпадать с паролем в `DATABASE_URL`)
- `DATABASE_URL` — строка подключения к БД (хост `postgres:5432`)
- `PAYLOAD_SECRET` — секрет Payload (≥32 символов)
- `S3_ACCESS_KEY`, `S3_SECRET_KEY` — учётные данные MinIO
- `REDIS_URL` — `redis://redis:6379`

### 2. Собрать образы приложения и миграций

```bash
# Образ для запуска приложения (production)
docker build -t 3dpartner:latest .

# Образ для Job миграций (нужен только если будете запускать k8s/migrate-job.yaml)
docker build --target builder -t 3dpartner:migrate .
```

Для своего registry добавьте теги и push для обоих образов. В манифестах при необходимости замените `image: 3dpartner:latest` и в `migrate-job.yaml` — `image: 3dpartner:migrate` на образы из registry.

### 3. Применить манифесты

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/minio.yaml
# Дождаться готовности Postgres/MinIO
kubectl apply -f k8s/app.yaml
kubectl apply -f k8s/ingress.yaml
```

Или одной командой (после создания `secret.yaml`):

```bash
kubectl apply -f k8s/
```

Флаг `--validate=false` отключает только проверку по OpenAPI; для `kubectl apply` всё равно нужен работающий кластер (см. раздел выше).

### 4. Бакет MinIO для медиа (S3)

В `minio.yaml` описан Job `minio-create-bucket`: после старта MinIO он создаёт бакет `3dpartner`, в который Payload складывает все загрузки (коллекция media). Переменные S3 заданы в ConfigMap (`S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`) и в Secret (`S3_ACCESS_KEY`, `S3_SECRET_KEY`). Приложение получает их через `envFrom` и отдаёт медиа в S3/MinIO.

## Ресурсы

| Компонент   | Реплики | Масштабирование      |
|------------|---------|----------------------|
| 3dpartner  | 2–10    | HPA по CPU 70%       |
| Postgres   | 1       | StatefulSet + PVC    |
| Redis      | 1       | Deployment           |
| MinIO      | 1       | Deployment + PVC     |

## Проверка

```bash
kubectl get pods -n 3dpartner
kubectl get svc -n 3dpartner
kubectl get ingress -n 3dpartner
```

## Ошибка 42P01 (relation does not exist)

Если приложение падает с **code: '42P01'** (таблица не найдена), в БД ещё не применены миграции Payload. В конфиге включено **prodMigrations**: при первом старте приложение само выполняет миграции из `src/migrations`. Убедитесь, что:

1. В образ попала папка `src/migrations` (она в репозитории и копируется при `COPY . .` в Dockerfile).
2. Под приложения успешно стартует и получает `DATABASE_URL` из Secret — дайте поду 30–60 секунд на первый запуск (миграции выполняются при инициализации Payload).

Если ошибка не исчезает, один раз примените миграции через Job. Сначала соберите образ миграций (стадия builder, в нём есть pnpm и payload CLI):

```bash
docker build --target builder -t 3dpartner:migrate .
docker save 3dpartner:migrate | sudo k3s ctr images import -   # если используете k3s на той же машине
```

Затем запустите Job:

```bash
kubectl apply -f k8s/migrate-job.yaml -n 3dpartner
kubectl logs -f job/payload-migrate -n 3dpartner   # дождаться успешного завершения
kubectl delete job payload-migrate -n 3dpartner  # опционально, Job удалится сам через 5 мин (ttlSecondsAfterFinished)
```

После успешного выполнения поды приложения перезапустите: `kubectl rollout restart deployment/app-3dpartner -n 3dpartner`.

## TLS

В `k8s/ingress.yaml` раскомментируйте блок `tls` и создайте Secret с сертификатом:

```bash
kubectl create secret tls 3dpartner-tls --cert=path/to/tls.crt --key=path/to/tls.key -n 3dpartner
```

Либо используйте [cert-manager](https://cert-manager.io/) для автоматического выпуска сертификатов.
