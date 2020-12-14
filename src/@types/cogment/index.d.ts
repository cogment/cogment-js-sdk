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

import {applyDeltaReplace} from '../../lib/DeltaEncoding';
import * as jspb from 'google-protobuf';

export * from './CogmentYaml';

export interface CogSettingsActorClass {
  id: string;
  config_type: typeof jspb.Message | null;
  action_space: typeof jspb.Message;
  observation_space: typeof jspb.Message;
  observation_delta: typeof jspb.Message;
  observation_delta_apply_fn: typeof applyDeltaReplace;
  feedback_space: typeof jspb.Message | null;
  message_space: typeof jspb.Message | null;
}

export interface CogSettings {
  actor_classes: Record<string, CogSettingsActorClass>;
  trial: {
    config_type: typeof jspb.Message | null;
  };
  environment: {
    config_type: typeof jspb.Message | null;
  };
  env_class: {
    id: string;
    config_type: typeof jspb.Message | null;
    message_space: typeof jspb.Message | null;
  };
  connection: {
    http: string;
  };
}

declare module 'cog_settings' {
  const cogSettings: CogSettings;
  export {cogSettings};
}
