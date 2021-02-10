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
import {CogSettingsActorClass} from '../@types/cogment';
import {ObservationData} from '../cogment/api/common_pb';

export function decodeObservationData<T extends Message>({
  actorClass,
  data,
}: {
  actorClass: CogSettingsActorClass;
  data: ObservationData;
}): T {
  if (data.getSnapshot()) {
    return actorClass.observation_space.deserializeBinary(
      data.getContent_asU8(),
      // TODO: lazy hack around type system by casting here
    ) as T;
  } else {
    const delta = actorClass.observation_delta.deserializeBinary(
      data.getContent_asU8(),
    );
    // TODO: lazy hack around type system by casting here
    return actorClass.observation_delta_apply_fn(delta) as T;
  }
}

/**
 * A protobuf message type containing a `content` field of type bytes.
 */
export interface SerializableProtobuf extends Message {
  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): void;
}

/**
 * Turn any protobuf message with a `content` field (implements the {@link SerializableProtobuf} interface) into a
 * `destinationPb` type protobuf message.
 *
 * @typeParam T - Return protobuf message type
 *
 * @param sourcePb - A protobuf message that implements the {@link SerializableProtobuf} interface
 * @param destinationPb - A protobuf message class to deserialize into
 * @returns A protobuf message of type `destinationPb` with the contents of `sourcePb`
 *
 * @internal
 */
export function deserializeData<T extends Message>({
  sourcePb,
  destinationPb,
}: {
  sourcePb: SerializableProtobuf;
  destinationPb: typeof Message;
}): T {
  return destinationPb.deserializeBinary(sourcePb.getContent_asU8()) as T;
}
