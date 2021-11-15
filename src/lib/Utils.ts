import {grpc} from '@improbable-eng/grpc-web';
import {Message, Message as MessageGrpc} from 'google-protobuf';
import {MessageBase, MessageClass} from '../cogment/types/UtilTypes';

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

export function frameRequest(request: Message): Uint8Array {
  const bytes = request.serializeBinary();
  const frame = new ArrayBuffer(bytes.byteLength + 5);
  new DataView(frame, 1, 4).setUint32(0, bytes.length, false /* big endian */);
  new Uint8Array(frame, 5).set(bytes);
  return new Uint8Array(frame);
}

export const streamToGenerator = <S extends Message, T extends Message>(
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
            console.log('writing request');
            writeableStream.write(request);
            console.log('written');
          } catch (e) {
            console.log('Error while sending the following request');
            console.log(request);
            throw e;
          }
        }
      }
      console.log('request queue exited');
    };
    inputStream();
  }

  async function* generator() {
    const data: T[] = [];

    let nextDataResolve: (going: boolean) => void;
    let nextDataPromise = new Promise<boolean>(
      (resolve) => (nextDataResolve = resolve),
    );

    stream.on('data', (newData: T) => {
      console.log('got data');
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

export class AsyncQueue<T> {
  private _data: T[] = [];
  private _nextDataResolve: (going: boolean) => void = () => {};
  private _nextDataPromise: Promise<boolean>;
  constructor() {
    this._nextDataPromise = new Promise<boolean>(
      (resolve) => (this._nextDataResolve = resolve),
    );
  }

  public put = (newData: T) => {
    this._data.push(newData);
    if (this._nextDataResolve) {
      this._nextDataResolve(true);
    }

    this._nextDataPromise = new Promise(
      (resolve) => (this._nextDataResolve = resolve),
    );
  };

  public get = async () => {
    if (this._data.length) {
      return this._data.shift();
    }

    const doContinue = await this._nextDataPromise;
    if (!doContinue) {
      return;
    }
    if (!this._data.length) {
      return;
    }

    return this._data.shift();
  };

  public end = () => {
    this._nextDataResolve(false);
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
