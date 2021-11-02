import { grpc } from "@improbable-eng/grpc-web";

export type Status = { details: string, code: number; metadata: grpc.Metadata }

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
    on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
    on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
    on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

const streamToGenerator = <T>(stream: BidirectionalStream<any, T> | ResponseStream<T>) => {
    async function* generator() {
        let going = true;

        let nextDataResolve: (data: T) => void;
        const nextData = new Promise<T>(
            (resolve) => (nextDataResolve = resolve),
        );

        stream.on("data", (newData: T))

        while (going) {

        }
    }

    return
}