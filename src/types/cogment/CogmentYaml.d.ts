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

export interface CogmentYamlActorClass {
  id: string;
  action: {
    space: string;
  };
  observation: {
    space: string;
  };
}

export interface CogmentYamlTrialParameters {
  max_inactivity?: number;
  max_steps?: number;
  environment: {
    endpoint: string;
    config?: Record<string, unknown>;
  };
  actors: CogmentYamlActor[];
}

export interface CogmentYamlDatalog {
  type: 'grpc';
  url: string;
}

export interface CogmentYamlActor {
  actor_class: string;
  endpoint: string;
}

export interface CogmentYaml {
  import: {
    proto: string[];
  };
  commands: Record<string, string>;
  environment: {
    config_type: string;
  };
  trial: {
    config_type: string;
  };
  pre_hooks?: string[];
  actor_classes: CogmentYamlActorClass[];
  trial_params: CogmentYamlTrialParameters;
  datalog?: CogmentYamlDatalog;
}
