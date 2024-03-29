import {grpc} from '@improbable-eng/grpc-web';
import {Message} from 'google-protobuf';
import {base64ToUint8Array} from '../lib/Utils';
import {ActorSession} from './Actor';
import {TrialLifecycleSPClient} from './api/orchestrator_pb_service';
import {ClientServicer} from './ClientService';
import {Controller} from './Control';
import {CogSettings, TrialActor} from './types';
import {MessageBase} from './types/UtilTypes';

Message.bytesAsU8 = function (value) {
  if (typeof value === 'string') {
    return base64ToUint8Array(value);
  }
  return value;
};

export enum TransportType {
  WEBSOCKET = 'websocket',
  HTTP = 'http',
}

export const getTransportFactory = (type: TransportType) => {
  switch (type) {
    case TransportType.WEBSOCKET:
      return grpc.WebsocketTransport();
    case TransportType.HTTP:
      return grpc.CrossBrowserHttpTransport({
        withCredentials: false,
      });
    default:
      throw new Error(`Unknown transport type: ${type}`);
  }
};

export type ActorImplementation<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
> = (session: ActorSession<ActionT, ObservationT>) => Promise<void>;

export class Context<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
> {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<ActionT, ObservationT>]
  > = {};
  private controller?: Controller;
  constructor(
    private cogSettings: CogSettings,
    private userId = 'client',
    private transportType = TransportType.WEBSOCKET,
  ) {
    grpc.setDefaultTransport(getTransportFactory(this.transportType));
  }

  public registerActor = (
    actorImpl: ActorImplementation<ActionT, ObservationT>,
    actorName: string,
    actorClass: string,
  ): void => {
    if (this.actors[actorName]) {
      console.warn(
        `Actor with name ${actorName} already registered, overwriting.`,
      );
    }

    this.actors[actorName] = [{name: actorName, actorClass}, actorImpl];
  };

  getControlStub(endpoint: string) {
    return new TrialLifecycleSPClient(endpoint, {
      transport: getTransportFactory(
        this.transportType === TransportType.WEBSOCKET
          ? TransportType.HTTP
          : this.transportType,
      ),
    });
  }

  getController = (endpoint?: string) => {
    if (!this.controller) {
      if (!endpoint) {
        throw new Error(
          'No endpoint provided and Controller was not initialized',
        );
      }
      const stub = this.getControlStub(endpoint);
      this.controller = new Controller(this.cogSettings, stub, this.userId);
    }
    return this.controller as Controller;
  };

  joinTrial = async (trialId: string, endpoint: string, actorName: string) => {
    const servicer = new ClientServicer<ActionT, ObservationT>(
      this.cogSettings,
      endpoint,
    );

    const initData = await servicer.join(trialId, actorName);

    if (!initData) throw new Error('initialData not received');

    if (actorName != initData.actorName)
      throw new Error(
        `Internal error: Actor name [${actorName}] requested, received: ${initData.actorName}`,
      );

    const actorImpl = this.actors[actorName][1];

    await servicer.runSession(actorImpl, initData);
  };
}
