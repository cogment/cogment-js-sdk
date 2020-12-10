#!/usr/bin/env bash
#
#  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#

SCRIPT_NAME="$(basename ${0})"
COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
END_TO_END_APP_PATH=${END_TO_END_APP_PATH:-__tests__/end-to-end/cogment-app}

_log() {
  printf "%s " "${SCRIPT_NAME}:"
  printf "%s\n" "${@}"
}

_err() {
  _log "${@}"
  exit 1
}

if [[ ! -r "${END_TO_END_APP_PATH}/cogment.yaml" ]]; then
  _err "Unable to find cogment application at ${END_TO_END_APP_PATH}"
fi

pushd "${END_TO_END_APP_PATH}" || _err "Unable to access ${END_TO_END_APP_PATH}"

export COMPOSE_PROJECT_NAME
