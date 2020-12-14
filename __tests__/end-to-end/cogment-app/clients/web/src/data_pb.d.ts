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
  getTime(): number;
  setTime(value: number): void;

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
    time: number,
  }
}

export class EmmaAction extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmmaAction.AsObject;
  static toObject(includeInstance: boolean, msg: EmmaAction): EmmaAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmmaAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmmaAction;
  static deserializeBinaryFromReader(message: EmmaAction, reader: jspb.BinaryReader): EmmaAction;
}

export namespace EmmaAction {
  export type AsObject = {
  }
}

export class TimeAction extends jspb.Message {
  getTime(): number;
  setTime(value: number): void;

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
    time: number,
  }
}

export class Reward extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Reward.AsObject;
  static toObject(includeInstance: boolean, msg: Reward): Reward.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Reward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Reward;
  static deserializeBinaryFromReader(message: Reward, reader: jspb.BinaryReader): Reward;
}

export namespace Reward {
  export type AsObject = {
  }
}

export class AsyncMessage extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AsyncMessage.AsObject;
  static toObject(includeInstance: boolean, msg: AsyncMessage): AsyncMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AsyncMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AsyncMessage;
  static deserializeBinaryFromReader(message: AsyncMessage, reader: jspb.BinaryReader): AsyncMessage;
}

export namespace AsyncMessage {
  export type AsObject = {
  }
}

