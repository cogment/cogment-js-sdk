#!/usr/bin/env bash

set -o errexit

COGMENT_DIR="$(cd "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/../.cogment"
COGMENT_VERSION=${COGMENT_VERSION:-2.10.0}

#Install cogment
mkdir -p "${COGMENT_DIR}"
cd "${COGMENT_DIR}"
curl -sL https://raw.githubusercontent.com/cogment/cogment/main/install.sh | bash /dev/stdin --skip-install --version "${COGMENT_VERSION}"
