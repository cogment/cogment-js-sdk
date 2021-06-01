/*
 *  Copyright 2021 AI Redefined Inc. <dev+cogment@ai-r.com>
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

/**
 * A protobuf message type containing a `content` field of type bytes.
 */
export interface SerializableProtobuf extends Message {
  getContent(): Uint8Array | string;

  getContent_asB64(): string;

  getContent_asU8(): Uint8Array;

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
