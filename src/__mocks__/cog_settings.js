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

import {applyDeltaReplace} from '../lib/DeltaEncoding';
import protos from './data_pb.mock';

const _client_class = {
  id: 'client',
  config_type: undefined,
  action_space: protos.ClientAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  feedback_space: undefined,
  message_space: undefined,
};

const _time_class = {
  id: 'time',
  config_type: undefined,
  action_space: protos.TimeAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  feedback_space: undefined,
  message_space: undefined,
};

const settings = {
  actor_classes: {
    client: _client_class,
    time: _time_class,
  },

  trial: {
    config_type: protos.TrialConfig,
  },

  environment: {
    config_type: protos.EnvConfig,
  },

  env_class: {
    id: 'env',
    config_type: undefined,
    message_space: undefined,
  },

  connection: {
    backendUrl: 'http://localhost:8080',
  },
};

export default settings;
