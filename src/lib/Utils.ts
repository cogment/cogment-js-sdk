import { grpc } from '@improbable-eng/grpc-web';
import { Message as MessageGrpc } from 'google-protobuf';
import { MessageBase, MessageClass } from '..';

export type Status = { details: string; code: number; metadata: grpc.Metadata };

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

export const streamToGenerator = <T>(
  stream: BidirectionalStream<any, T> | ResponseStream<T>,
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

export class AsyncQueue<T> {
  private _data: T[] = [];
  private _nextDataResolve: (going: boolean) => void = () => { };
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

export const staticCastFromGoogle = <T extends MessageBase>(source: MessageGrpc, destClass: MessageClass): T => {
  const binary = source.serializeBinary();
  const deserialized = destClass.decode(binary);

  return deserialized as T;
};
