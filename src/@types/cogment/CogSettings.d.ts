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

import {Message} from 'google-protobuf';
import {applyDeltaReplace} from '../../lib/DeltaEncoding';

export interface CogSettingsActorClass {
  id: string;
  config_type: typeof Message | null;
  action_space: typeof Message;
  observation_space: typeof Message;
  observation_delta: typeof Message;
  observation_delta_apply_fn: typeof applyDeltaReplace;
  feedback_space: typeof Message | null;
  message_space: typeof Message | null;
}

export interface CogSettings {
  actor_classes: Record<string, CogSettingsActorClass>;
  trial: {
    config_type: typeof Message | null;
  };
  environment: {
    config_type: typeof Message | null;
  };
  env_class: {
    id: string;
    config_type: typeof Message | null;
    message_space: typeof Message | null;
  };
  connection: {
    http: string;
  };
}
