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

import * as jspb from 'google-protobuf';
import {applyDeltaReplace} from '../../lib/DeltaEncoding';

export interface CogSettingsJsActorClass {
  id: string;
  config_type?: typeof jspb.Message;
  action_space: typeof jspb.Message;
  observation_space: typeof jspb.Message;
  observation_delta: typeof jspb.Message;
  observation_delta_apply_fn: typeof applyDeltaReplace;
  feedback_space?: typeof jspb.Message;
  message_space?: typeof jspb.Message;
}

export interface CogSettingsJs {
  actor_classes: Record<string, CogSettingsJsActorClass>;
  trial: {
    config_type: typeof jspb.Message;
  };
  environment: {
    config_type: typeof jspb.Message;
  };
  env_class: {
    id: string;
    config_type?: typeof jspb.Message;
    message_space?: typeof jspb.Message;
  };
}

declare module 'cog_settings.js' {
  const settings: CogSettingsJs;
  export default settings;
}
