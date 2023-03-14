#!/usr/bin/env bash

set -o errexit

PY_SERVICES_DIR="$(cd "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/../py-services"
COGMENT_PY_SDK_VERSION=${COGMENT_PY_SDK_VERSION:-2.6.0}

cp cogment.yaml "${PY_SERVICES_DIR}"
cp data.proto "${PY_SERVICES_DIR}"

cd "${PY_SERVICES_DIR}"
python3 -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
pip3 install "cogment[generate]==${COGMENT_PY_SDK_VERSION}"
python3 -m cogment.generate --spec cogment.yaml
deactivate
