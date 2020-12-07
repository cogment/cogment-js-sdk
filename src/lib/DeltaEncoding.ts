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

import {CogSettingsJsActorClass} from '../types/cogment';
import * as jspb from 'google-protobuf';

export function applyDeltaReplace(
  observation: jspb.Message,
  delta: jspb.Message,
) {
  return delta;
}

export function decodeObservationData(
  actorClass: CogSettingsJsActorClass,
  data: jspb.Message,
  previousObservation: jspb.Message,
) {
  if (data.getSnapshot()) {
    return actorClass.observation_space.deserializeBinary(data.getContent());
  } else {
    const delta = new actorClass.observation_delta.deserializeBinary(
      data.getContent(),
    );
    return actorClass.observation_delta_apply_fn(previousObservation, delta);
  }
}
