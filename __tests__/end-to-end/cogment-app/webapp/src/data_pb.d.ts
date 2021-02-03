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
  getTimestamp(): number;
  setTimestamp(value: number): void;

  getRequest(): string;
  setRequest(value: string): void;

  getResponse(): string;
  setResponse(value: string): void;

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
    timestamp: number,
    request: string,
    response: string,
  }
}

export class ClientAction extends jspb.Message {
  getRequest(): string;
  setRequest(value: string): void;

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
    request: string,
  }
}

export class EchoAction extends jspb.Message {
  getResponse(): string;
  setResponse(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EchoAction.AsObject;
  static toObject(includeInstance: boolean, msg: EchoAction): EchoAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EchoAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EchoAction;
  static deserializeBinaryFromReader(message: EchoAction, reader: jspb.BinaryReader): EchoAction;
}

export namespace EchoAction {
  export type AsObject = {
    response: string,
  }
}

export class ClientMessage extends jspb.Message {
  getRequest(): string;
  setRequest(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessage): ClientMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessage;
  static deserializeBinaryFromReader(message: ClientMessage, reader: jspb.BinaryReader): ClientMessage;
}

export namespace ClientMessage {
  export type AsObject = {
    request: string,
  }
}

export class EchoMessage extends jspb.Message {
  getResponse(): string;
  setResponse(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EchoMessage.AsObject;
  static toObject(includeInstance: boolean, msg: EchoMessage): EchoMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EchoMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EchoMessage;
  static deserializeBinaryFromReader(message: EchoMessage, reader: jspb.BinaryReader): EchoMessage;
}

export namespace EchoMessage {
  export type AsObject = {
    response: string,
  }
}

