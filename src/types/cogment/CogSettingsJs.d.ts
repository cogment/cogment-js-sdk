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

import type * as jspb from 'google-protobuf';

export interface CogSettingsJsActorClass {
  id: string;
  config_type?: jspb.Message;
  action_space: jspb.Message;
  observation_space: jspb.Message;
  observation_delta: jspb.Message;
  observation_delta_apply_fn: string;
  feedback_space?: string;
  message_space?: string;
}

export interface CogSettingsJs {
  actor_classes: Record<string, CogSettingsJsActorClass>;
  trial: {
    config_type: jspb.Message;
  };
  environment: {
    config_type: jspb.Message;
  };
  env_class: {
    id: string;
    config_type?: jspb.Message;
    message_space?: jspb.Message;
  };
}

declare module 'cog_settings*' {
  const source: CogSettingsJs;
  export const source: CogSettingsJs;
  export const cogSettings: CogSettingsJs;
  export default source;
}
