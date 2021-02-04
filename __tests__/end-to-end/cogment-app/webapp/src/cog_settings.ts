/*
 *  Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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

import * as data_pb from './data_pb';

const _client_class = {
  id: 'client',
  config_type: null,
  action_space: data_pb.ClientAction,
  observation_space: data_pb.Observation,
  observation_delta: data_pb.Observation,
  observation_delta_apply_fn: (x: any) => x,
  feedback_space: null,
  message_space: null,
};

const _echo_class = {
  id: 'echo',
  config_type: null,
  action_space: data_pb.EchoAction,
  observation_space: data_pb.Observation,
  observation_delta: data_pb.Observation,
  observation_delta_apply_fn: (x: any) => x,
  feedback_space: null,
  message_space: null,
};

const settings = {
  actor_classes: {
    client: _client_class,
    echo: _echo_class,
  },

  trial: {
    config_type: data_pb.TrialConfig,
  },

  environment: {
    config_type: data_pb.EnvConfig,
  },

  env_class: {
    id: 'env',
    config_type: null,
    message_space: null,
  },
};

export default settings;
export type Settings = typeof settings;
