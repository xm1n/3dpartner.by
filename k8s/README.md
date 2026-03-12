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

### Вариант B: Уже есть кластер в другом месте

Тогда на сервере `site` должен быть настроен доступ к нему:

- Либо скопировать на `site` файл kubeconfig с машины, где уже есть доступ к кластеру:
  ```bash
  scp user@cluster-server:~/.kube/config ~/.kube/config
  export KUBECONFIG=~/.kube/config
  ```
- Либо использовать облачный кластер (EKS, GKE, Yandex Cloud и т.д.) и установить их CLI + получить kubeconfig по инструкции провайдера.

Проверка: `kubectl cluster-info` и `kubectl get nodes` должны выполняться без ошибок. После этого `kubectl apply -f k8s/` применит манифесты в кластер.

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

### 2. Собрать образ приложения

```bash
docker build -t 3dpartner:latest .
# Для своего registry:
# docker tag 3dpartner:latest your-registry/3dpartner:latest
# docker push your-registry/3dpartner:latest
```

В манифестах при необходимости замените `image: 3dpartner:latest` на образ из вашего registry.

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

## TLS

В `k8s/ingress.yaml` раскомментируйте блок `tls` и создайте Secret с сертификатом:

```bash
kubectl create secret tls 3dpartner-tls --cert=path/to/tls.crt --key=path/to/tls.key -n 3dpartner
```

Либо используйте [cert-manager](https://cert-manager.io/) для автоматического выпуска сертификатов.
