#!/usr/bin/env bash
#
#  Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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

source bin/hack.bash

#docker-compose pull cogment-cli || _err "Failed to pull cogment-cli"
#docker-compose run cogment-cli run generate || _err "Failed to build cogment project"
docker-compose build "${ALL_SERVICES[@]}" || _err "Failed to build cogment-app"
