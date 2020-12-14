/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const {applyDeltaReplace} = require('cogment/src/lib/DeltaEncoding');
const protos = require('./data_pb');

const _emma_class = {
  id: 'emma',
  config_type: null,
  action_space: protos.EmmaAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  feedback_space: null,
  message_space: null,
};

const _time_class = {
  id: 'time',
  config_type: null,
  action_space: protos.TimeAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  feedback_space: null,
  message_space: null,
};

const settings = {
  actor_classes: {
    emma: _emma_class,
    time: _time_class,
  },

  trial: {
    config_type: null,
  },

  environment: {
    config_type: protos.EnvConfig,
  },

  env_class: {
    id: 'env',
    config_type: null,
    message_space: null,
  },

  connection: {
    http: 'http://grpcwebproxy:8080',
  },
};

module.exports = settings;
