# Kubernetes — кластеризация и оркестрация 3D Partner

Развёртывание приложения в кластере Kubernetes: несколько реплик приложения, Postgres, Redis, MinIO, Ingress.

## Требования

- Kubernetes 1.28+
- Ingress Controller (например [nginx-ingress](https://kubernetes.github.io/ingress-nginx/deploy/))
- Реестр образов (для продакшена: свой registry или Docker Hub)

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
