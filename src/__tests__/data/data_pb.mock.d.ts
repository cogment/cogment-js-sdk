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

// package: cogment_app
// file: data.proto

import * as jspb from "google-protobuf";

export class EnvConfig extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvConfig.AsObject;
  static toObject(includeInstance: boolean, msg: EnvConfig): EnvConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvConfig;
  static deserializeBinaryFromReader(message: EnvConfig, reader: jspb.BinaryReader): EnvConfig;
}

export namespace EnvConfig {
  export type AsObject = {
  }
}

export class TrialConfig extends jspb.Message {
  hasEnvConfig(): boolean;
  clearEnvConfig(): void;
  getEnvConfig(): EnvConfig | undefined;
  setEnvConfig(value?: EnvConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrialConfig.AsObject;
  static toObject(includeInstance: boolean, msg: TrialConfig): TrialConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrialConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrialConfig;
  static deserializeBinaryFromReader(message: TrialConfig, reader: jspb.BinaryReader): TrialConfig;
}

export namespace TrialConfig {
  export type AsObject = {
    envConfig?: EnvConfig.AsObject,
  }
}

export class Observation extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Observation.AsObject;
  static toObject(includeInstance: boolean, msg: Observation): Observation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Observation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Observation;
  static deserializeBinaryFromReader(message: Observation, reader: jspb.BinaryReader): Observation;
}

export namespace Observation {
  export type AsObject = {
  }
}

export class ClientAction extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClientAction): ClientAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientAction;
  static deserializeBinaryFromReader(message: ClientAction, reader: jspb.BinaryReader): ClientAction;
}

export namespace ClientAction {
  export type AsObject = {
  }
}

export class TimeAction extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeAction.AsObject;
  static toObject(includeInstance: boolean, msg: TimeAction): TimeAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeAction;
  static deserializeBinaryFromReader(message: TimeAction, reader: jspb.BinaryReader): TimeAction;
}

export namespace TimeAction {
  export type AsObject = {
  }
}

