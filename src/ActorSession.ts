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
import sortBy from 'lodash/sortBy';
import {
  CogSettings,
  CogSettingsActorClass,
  Event,
  Reward,
  TrialActor,
} from './@types/cogment';
import {Action as ActionPb} from './cogment/api/common_pb';
import {ServiceError} from './cogment/api/environment_pb_service';
import {
  TrialActionReply,
  TrialActionRequest,
  TrialJoinReply,
  TrialJoinRequest,
} from './cogment/api/orchestrator_pb';
import {ActorEndpointClient} from './cogment/api/orchestrator_pb_service';
import {deserializeData} from './lib/DeltaEncoding';
import {getLogger} from './lib/Logger';

const logger = getLogger('ActorSession');

export class ActorSession<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message,
  MessageT extends Message
> {
  private actorCogSettings: CogSettingsActorClass;
  private events: Event<ObservationT, RewardT, MessageT>[] = [];
  private running = false;

  constructor(
    private actorClass: TrialActor,
    private cogSettings: CogSettings,
    private actorEndpointClient: ActorEndpointClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {
    this.actorCogSettings = cogSettings.actor_classes[actorClass.class];
    this.actionStreamClient.onMessage(this.onActionStreamMessage.bind(this));
    this.actionStreamClient.onHeaders(this.onActionStreamHeaders.bind(this));
    this.actionStreamClient.onEnd(this.onActionStreamEnd.bind(this));
  }

  public addFeedback(to: string[], feedback: Reward): void {
    throw new Error('addFeedback() is not implemented.');
  }

  public async *eventLoop(): AsyncGenerator<
    Event<ObservationT, RewardT, MessageT>
  > {
    if (!this.running) {
      logger.warn('Trial is not currently running.');
    }
    while (this.running) {
      if (this.events[0]) {
        logger.debug(
          `Dispatching event ${JSON.stringify(
            this.events[0].observation?.toObject(),
            undefined,
            2,
          )}`,
        );
        yield this.events.splice(0, 1)[0];
      } else {
        logger.trace('No events available, sleeping 200ms');
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  public getTickId(): number {
    throw new Error('getTriaId() is not implemented');
  }

  public getTriaId(): string {
    throw new Error('getTriaId() is not implemented');
  }

  public isTrialOver(): boolean {
    throw new Error('isTrialOver() is not implemented');
  }

  public joinTrial(request: TrialJoinRequest): Promise<TrialJoinReply> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
      this.actorEndpointClient.joinTrial(
        request,
        (error: ServiceError | null, response: TrialJoinReply | null) => {
          if (error || !response) {
            return reject(error);
          }
          resolve(response);
        },
      );
    });
  }

  public sendAction(userAction: ActionT): void {
    const action = new ActionPb();
    action.setContent(userAction.serializeBinary());
    const request = new TrialActionRequest();
    request.setAction(action);
    this.actionStreamClient.send(request);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public sendMessage(to: string[], message: MessageT): void {
    throw new Error('sendMessage() is not implemented');
  }

  public start(): void {
    this.running = true;
  }

  public stop(): void {
    this.running = false;
  }

  private onActionStreamEnd(
    code: grpc.Code,
    message: string,
    trailers: grpc.Metadata,
  ) {
    logger.info(
      `actionStream received end, code: ${code}, message: ${message}, trailers: ${JSON.stringify(
        trailers,
        undefined,
        2,
      )}`,
    );
    // TODO: should we implicitly set the trial to running here?
    this.running = false;
  }

  private onActionStreamHeaders(headers: grpc.Metadata) {
    logger.info(
      `actionStream received headers: ${JSON.stringify(headers, undefined, 2)}`,
    );
  }

  private onActionStreamMessage(action: TrialActionReply) {
    const data = action.getData();
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

    // Assumes data received is all newer than the last received tickId
    const observations = sortBy(data.getObservationsList(), ({getTickId}) =>
      getTickId(),
    );
    const messages = sortBy(data.getMessagesList(), ({getTickId}) =>
      getTickId(),
    );
    const rewards = data.getRewardsList();

    // TODO: Do we need to worry about ordering received observations, rewards, messages by tickId?

    this.events = [
      ...this.events,
      ...observations
        .filter((observation) => {
          return observation.getData()?.getContent() !== '';
        })
        .map((observation) => {
          return {
            observation: deserializeData<ObservationT>(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              observation.getData(),
              this.actorCogSettings.observation_space,
            ),
          };
        }),
      ...messages.map((message) => ({
        message: {
          sender: message.getSenderName(),
          data: this.actorCogSettings.message_space?.deserializeBinary(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /// @ts-ignore-next-line
            message?.getPayload()?.getValue_asU8(),
          ) as MessageT,
        },
      })),
      ...rewards.map((reward) => ({
        reward: {
          tickId: reward.getFeedbacksList()[0].getTickId(),
          value: reward.getValue(),
          confidence: reward.getConfidence(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data: reward,
        },
      })),
    ];
  }
}
