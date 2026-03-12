#!/usr/bin/env bash
# Поднять кластер k3d, собрать образы, применить манифесты и миграции.
# Запускать из корня репозитория: ./k8s/k3d-up.sh

set -e
CLUSTER="${K3D_CLUSTER:-3dpartner}"
K8S_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$K8S_DIR/.." && pwd)"

echo "=== k3d cluster: $CLUSTER ==="

if ! k3d cluster list 2>/dev/null | grep -q "$CLUSTER"; then
  echo "Creating cluster $CLUSTER..."
  k3d cluster create "$CLUSTER" -p "80:80@loadbalancer" -p "443:443@loadbalancer"
else
  echo "Cluster $CLUSTER already exists."
fi

echo "=== Building images ==="
cd "$ROOT_DIR"
docker build -t 3dpartner:latest .
docker build --target builder -t 3dpartner:migrate .

echo "=== Importing images into k3d ==="
k3d image import 3dpartner:latest -c "$CLUSTER"
k3d image import 3dpartner:migrate -c "$CLUSTER"

if [[ ! -f "$K8S_DIR/secret.yaml" ]]; then
  echo "Create $K8S_DIR/secret.yaml from secret.yaml.example and run again."
  exit 1
fi

echo "=== Applying manifests ==="
kubectl apply -f "$K8S_DIR/namespace.yaml"
kubectl apply -f "$K8S_DIR/configmap.yaml"
kubectl apply -f "$K8S_DIR/secret.yaml"
kubectl apply -f "$K8S_DIR/postgres.yaml"
kubectl apply -f "$K8S_DIR/redis.yaml"
kubectl apply -f "$K8S_DIR/minio.yaml"

echo "Waiting for Postgres/MinIO to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n 3dpartner --timeout=120s 2>/dev/null || true
kubectl wait --for=condition=ready pod -l app=redis -n 3dpartner --timeout=60s 2>/dev/null || true

echo "=== Running migrations ==="
kubectl apply -f "$K8S_DIR/migrate-job.yaml" -n 3dpartner
echo "Wait for job: kubectl logs -f job/payload-migrate -n 3dpartner"
kubectl wait --for=condition=complete job/payload-migrate -n 3dpartner --timeout=120s 2>/dev/null || true

echo "=== Deploying app and ingress ==="
kubectl apply -f "$K8S_DIR/app.yaml" -n 3dpartner
kubectl apply -f "$K8S_DIR/ingress.yaml" -n 3dpartner

echo ""
echo "Done. To access the app:"
echo "  kubectl port-forward -n 3dpartner svc/app-3dpartner 3000:80"
echo "  Open http://localhost:3000"
echo ""
echo "Or add to /etc/hosts: 127.0.0.1 3dpartner.by  and open http://3dpartner.by"
