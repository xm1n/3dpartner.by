#!/usr/bin/env bash
# Удалить кластер k3d.
# Запускать из корня репозитория: ./k8s/k3d-down.sh

CLUSTER="${K3D_CLUSTER:-3dpartner}"
echo "Deleting k3d cluster: $CLUSTER"
k3d cluster delete "$CLUSTER"
