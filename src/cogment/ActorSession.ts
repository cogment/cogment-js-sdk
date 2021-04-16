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

import {grpc} from '@improbable-eng/grpc-web';
import {Message} from 'google-protobuf';
import {Any as AnyPb} from 'google-protobuf/google/protobuf/any_pb';
import {deserializeData} from '../lib/DeltaEncoding';
import {getLogger} from '../lib/Logger';
import {Action as ActionPb, Message as MessagePb} from './api/common_pb';
import {
  TrialActionReply,
  TrialActionRequest,
  TrialMessageRequest,
} from './api/orchestrator_pb';
import {ClientActorClient} from './api/orchestrator_pb_service';
import {SendMessageReturnType} from './TrialController';
import {
  CogSettings,
  CogSettingsActorClass,
  Event,
  EventType,
  Reward,
  TrialActor,
} from './types';
import {CogMessage} from './types/CogMessage';

const logger = getLogger('ActorSession');

/**
 * Controller object passed to each {@link ActorImplementation | `ActorImplementation`} callback.
 * @typeParam ActionT - The action space type for this actor class
 * @typeParam ObservationT - The observation space type for this actor class
 * @typeParam RewardT - The reward type for this actor class
 */
export class ActorSession<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message
> {
  private actorCogSettings: CogSettingsActorClass;
  private events: Event<ObservationT, RewardT>[] = [];
  private lastObservation?: ObservationT;
  private nextEventPromise?: Promise<void>;
  private nextEventResolve?: () => void;
  private running = false;
  private tickId?: number;

  /**
   *
   * @param actorClass - The actor class configuration
   * @param cogSettings - Generated CogSettings file, see {@link CogSettings | `CogSettings`}
   * @param clientActorClient - gRPC client for the ClientActor service
   * @param actionStreamClient - gRPC streaming client for the ClientActor.ActionStream endpoint
   * @internal
   */
  // eslint-disable-next-line max-params
  constructor(
    private actorClass: TrialActor,
    private cogSettings: CogSettings,
    private clientActorClient: ClientActorClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {
    this.actorCogSettings = cogSettings.actorClasses[actorClass.actorClass];

    this.actionStreamClient.onMessage(this.onActionStreamMessage);
    this.actionStreamClient.onHeaders(this.onActionStreamHeaders);
    this.actionStreamClient.onEnd(this.onActionStreamEnd);

    // eslint-disable-next-line compat/compat
    this.nextEventPromise = new Promise((resolve) => {
      this.nextEventResolve = resolve;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addFeedback(to: string[], feedback: Reward): void {
    throw new Error('addFeedback() is not implemented.');
  }

  /**
   * Yields observations, messages and rewards received from the Cogment framework.
   * @returns - A generator that yields observations, messages and rewards.
   */
  public async *eventLoop(): AsyncGenerator<Event<ObservationT, RewardT>> {
    if (!this.running) {
      logger.warn('Trial is not currently running.');
    }
    while (this.running) {
      const event = this.events.shift();
      if (event) {
        logger.debug(
          `Dispatching event for tick id ${
            event.tickId?.toString() ?? ''
          } ${JSON.stringify(event, undefined, 2)}`,
        );
        // TODO: think through the logic on this one
        if (event.observation) {
          this.lastObservation = event.observation;
        }

        yield event;
      } else {
        logger.trace('No events available');
        await this.nextEventPromise;
      }
    }
  }

  /**
   * Get the trial's current tick id, matching the latest received observation.
   * @returns - The current tick id.
   */
  public getTickId(): number | undefined {
    return this.tickId;
  }

  /**
   * Check if the trial is over.
   */
  public isTrialOver(): boolean {
    return typeof this.tickId !== 'undefined';
  }

  /**
   * Send an action to the environment.
   * @param userAction - An action space protobuf for this actor class.
   */
  public sendAction(userAction: ActionT): void {
    const action: ActionPb = new ActionPb();
    action.setContent(userAction.serializeBinary());
    action.setTickId(-1);
    const request = new TrialActionRequest();
    request.setAction(action);
    this.actionStreamClient.send(request);
  }

  /**
   * Send an asynchronous message to a cogment entity.
   * @param from - the source of this message
   * @param to - the destination of this message
   * @param payload - an Any.proto encoded protobuf instance
   * @param trialId - id of the trial to send a message to
   */
  public sendMessage = async ({
    from,
    to,
    payload,
    trialId,
  }: SendMessageOptions): Promise<SendMessageReturnType> => {
    const request = new TrialMessageRequest();
    const messagePb = new MessagePb();

    messagePb.setPayload(payload);
    messagePb.setSenderName(from);
    messagePb.setReceiverName(to);
    // TODO: remove on next release of orchestrator
    messagePb.setTickId(-1);
    request.setMessagesList([messagePb]);
    // eslint-disable-next-line compat/compat
    return new Promise<SendMessageReturnType>((resolve, reject) => {
      this.clientActorClient.sendMessage(
        request,
        new grpc.Metadata({'trial-id': trialId, 'actor-name': from}),
        (error, response) => {
          if (error || response === null) {
            return reject(error);
          }
          resolve(response.toObject());
        },
      );
    });
  };

  /**
   * Start this ActorSession, the eventLoop will begin yielding events received from the Cogment framework.
   */
  public start(): void {
    this.running = true;
  }

  /**
   * End this ActorSession, ending the eventLoop.
   */
  public stop(): void {
    this.running = false;
  }

  private onActionStreamEnd = (
    code: grpc.Code,
    message: string,
    trailers: grpc.Metadata,
    // eslint-disable-next-line max-params
  ) => {
    logger.info(
      `actionStream received end, code: ${code}, message: ${message}, trailers: ${JSON.stringify(
        trailers,
        undefined,
        2,
      )}`,
    );
    // TODO: should we implicitly set the trial to running here?
    this.running = false;
  };

  private onActionStreamHeaders = (headers: grpc.Metadata) => {
    logger.info(
      `actionStream received headers: ${JSON.stringify(headers, undefined, 2)}`,
    );
  };

  private onActionStreamMessage = (action: TrialActionReply) => {
    const data = action.getData();
    const type = action.getFinalData() ? EventType.FINAL : EventType.ACTIVE;
    if (!data) {
      return logger.warn('Received an action without any data');
    }
    logger.trace(
      `Received a raw action ${JSON.stringify(
        action.toObject(),
        undefined,
        2,
      )}`,
    );

    const observations = [...data.getObservationsList()]
      // TODO: is this necessary?
      .filter((observation) => {
        return observation.getData()?.getContent() !== '';
      })
      .map((observation) => {
        return {
          tickId: observation.getTickId(),
          timestamp: observation.getTimestamp(),
          observation: deserializeData<ObservationT>({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sourcePb: observation.getData(),
            destinationPb: this.actorCogSettings.observationSpace,
          }),
          type,
        };
      });

    const messages: {message: CogMessage; tickId: number; type: EventType}[] = [
      ...data.getMessagesList(),
    ].map((message) => {
      return {
        tickId: message.getTickId(),
        message: {
          tickId: message.getTickId(),
          receiver: message.getReceiverName(),
          sender: message.getSenderName(),
          data: message.getPayload(),
        },
        type,
      };
    });

    const rewards = [...data.getRewardsList()].map((reward) => {
      return {
        ...reward.toObject(),
        type,
      };
    });

    this.events = [
      ...this.events,
      ...messages,
      ...rewards,
      ...observations,
    ].sort(
      ({tickId: tickIdA}, {tickId: tickIdB}) => (tickIdA ?? 0) - (tickIdB ?? 0),
    );

    if (this.events[0]) {
      if ((this.events[0]?.tickId ?? 0) >= 0) {
        this.tickId = this.events[0]?.tickId;
      }
      if (this.nextEventResolve) {
        this.nextEventResolve();
      }
      this.nextEventPromise = new Promise(
        (resolve) => (this.nextEventResolve = resolve),
      );
    }
  };
}

export interface SendMessageOptions {
  /**
   * The unique identifier for the connected actor generating the message.
   */
  from: string;
  /**
   * The payload data, encoded as an Any protobuf message.
   */
  payload: AnyPb;
  /**
   * The unique identifier for the messages destination. Can be another actors name, or the special value `env` to send
   * a message to the environment.
   */
  to: string;
  /**
   * The id of the trial to send the message to.
   */
  trialId: string;
}
