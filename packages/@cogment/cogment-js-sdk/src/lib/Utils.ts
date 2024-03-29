import {grpc} from '@improbable-eng/grpc-web';
import {Message, Message as MessageGrpc} from 'google-protobuf';
import {MessageBase, MessageClass} from '../cogment/types/UtilTypes';
import {google} from '../cogment/api/common_pb_2';

export type Status = {details: string; code: number; metadata: grpc.Metadata};

interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}

interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(
    type: 'data',
    handler: (message: ResT) => void,
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'end',
    handler: (status?: Status) => void,
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'status',
    handler: (status: Status) => void,
  ): BidirectionalStream<ReqT, ResT>;
}

export const base64ToUint8Array = (base64: string) => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

export const streamToGenerator = <S extends Message, T extends Message>(
  stream: BidirectionalStream<S, T> | ResponseStream<T>,
) => {
  async function* generator() {
    const data: T[] = [];

    let nextDataResolve: (going: boolean) => void;
    let nextDataPromise = new Promise<boolean>(
      (resolve) => (nextDataResolve = resolve),
    );

    stream.on('data', (newData: T) => {
      data.push(newData);
      if (nextDataResolve) {
        nextDataResolve(true);
      }

      nextDataPromise = new Promise((resolve) => (nextDataResolve = resolve));
    });

    stream.on('end', () => {
      nextDataResolve(false);
    });

    while (true) {
      const trialListEntry = data.shift();
      if (trialListEntry) {
        yield trialListEntry;
      } else {
        const doContinue = await nextDataPromise;
        if (!doContinue) {
          break;
        }
      }
    }
  }
  return generator;
};

export const streamToQueue = <S extends Message, T extends Message>(
  stream: BidirectionalStream<S, T> | ResponseStream<T>,
  requestQueue?: AsyncQueue<S>,
) => {
  if ((stream as BidirectionalStream<S, T>).write && requestQueue) {
    const writeableStream = stream as BidirectionalStream<S, T>;
    const inputStream = async () => {
      let going = true;
      while (going) {
        const request = await requestQueue.get();
        if (!request) {
          going = false;
        } else {
          try {
            writeableStream.write(request);
          } catch (error) {
            console.error(
              `error while writing [${request}] to the stream`,
              error,
            );
            throw error;
          }
        }
      }
    };
    inputStream();
  }

  const queue = new AsyncQueue<T>();

  const generator = async () => {
    const data: T[] = [];

    let nextDataResolve: (going: boolean) => void;
    let nextDataPromise = new Promise<boolean>(
      (resolve) => (nextDataResolve = resolve),
    );

    stream.on('data', (newData: T) => {
      data.push(newData);
      if (nextDataResolve) {
        nextDataResolve(true);
      }

      nextDataPromise = new Promise((resolve) => (nextDataResolve = resolve));
    });

    stream.on('end', () => {
      nextDataResolve(false);
    });

    while (true) {
      const trialListEntry = data.shift();
      if (trialListEntry) {
        queue.put(trialListEntry);
      } else {
        const doContinue = await nextDataPromise;
        if (!doContinue) {
          break;
        }
      }
    }
  };
  generator();

  return queue;
};

export class AsyncQueue<T> {
  private data: T[] = [];
  private nextDataResolve: (going: boolean) => void = () => {};
  private nextDataPromise: Promise<boolean>;
  constructor() {
    this.nextDataPromise = new Promise<boolean>(
      (resolve) => (this.nextDataResolve = resolve),
    );
  }

  public put = (newData: T) => {
    this.data.push(newData);
    if (this.nextDataResolve) {
      this.nextDataResolve(true);
    }

    this.nextDataPromise = new Promise(
      (resolve) => (this.nextDataResolve = resolve),
    );
  };

  public get = async () => {
    if (this.data.length) {
      return this.data.shift();
    }

    const doContinue = await this.nextDataPromise;
    if (!doContinue) {
      return;
    }
    if (!this.data.length) {
      return;
    }

    return this.data.shift();
  };

  public end = () => {
    this.nextDataResolve(false);
  };
}

export const staticCastFromGoogle = <T extends MessageBase>(
  source: MessageGrpc,
  destClass: MessageClass,
): T => {
  const binary = source.serializeBinary();
  const deserialized = destClass.decode(binary);

  return deserialized as T;
};

export const encodePbMessage = (
  messageClass: MessageClass,
  message: MessageBase,
) => {
  const encodedMessage: any = messageClass.encode(message).finish();

  if (encodedMessage instanceof Uint8Array) {
    return encodedMessage;
  } else {
    // Actually, in some environment (including node & jsdom) encode returns a Buffer (and not a Uint8Array)
    return new Uint8Array(
      encodedMessage.buffer,
      encodedMessage.byteOffset,
      encodedMessage.length,
    );
  }
};

export const messageToAnyPB = (message: MessageBase) => {
  const messageClass = message.constructor as MessageClass;
  if (!(messageClass as any).getTypeUrl()) {
    throw new Error(
      `protobuf message must have a typeUrl, attempted to send message of type "${
        messageClass.name
      }": ${JSON.stringify(messageClass)}`,
    );
  }

  const serializedMessage = encodePbMessage(messageClass, message);

  const anyPB = new google.protobuf.Any();
  anyPB.value = serializedMessage;
  anyPB.type_url = (messageClass as any).getTypeUrl();
  return anyPB;
};
