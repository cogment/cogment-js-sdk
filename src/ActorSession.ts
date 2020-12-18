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

import {grpc} from '@improbable-eng/grpc-web';
import {Message} from 'google-protobuf';
import concat from 'lodash/concat';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import {Event, Reward, TrialActor} from './@types/cogment';
import {Reward as RewardPb} from './cogment/api/agent_pb';
import {
  Action as ActionPb,
  Message as MessagePb,
  Observation as ObservationPb,
} from './cogment/api/common_pb';
import {ServiceError} from './cogment/api/environment_pb_service';
import {
  TrialActionReply,
  TrialActionRequest,
  TrialJoinReply,
  TrialJoinRequest,
} from './cogment/api/orchestrator_pb';
import {ActorEndpointClient} from './cogment/api/orchestrator_pb_service';
import {logger} from './lib/Logger';
import warning from 'tiny-warning';

export class ActorSession<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message,
  MessageT extends Message
> {
  private running = false;
  private events: Event<ObservationPb, RewardPb, MessagePb>[] = [];

  // TODO: Look at passing in cogSettings here? And trialId?
  constructor(
    private actorEndpointClient: ActorEndpointClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {
    this.actionStreamClient.onMessage(this.onActionStreamMessage.bind(this));
    this.actionStreamClient.onHeaders(this.onActionStreamHeaders.bind(this));
    this.actionStreamClient.onEnd(this.onActionStreamEnd.bind(this));
  }

  private onActionStreamHeaders(headers: grpc.Metadata) {
    logger.info(
      `actionStream received headers: ${JSON.stringify(headers, undefined, 2)}`,
    );
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

  private onActionStreamMessage(action: TrialActionReply) {
    const data = action.getData();
    if (!data) {
      return logger.warn('Received an action without any data');
    }
    logger.info(
      `Received an action ${JSON.stringify(action.toObject(), undefined, 2)}`,
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
    this.events = concat(
      this.events,
      map(observations, (observation) => ({observation})),
      map(messages, (message) => ({
        message: {
          sender: message.getSenderName(),
          data: message,
        },
      })),
      map(rewards, (reward) => ({
        reward: {
          tickId: reward.getFeedbacksList()[0].getTickId(),
          value: reward.getValue(),
          confidence: reward.getConfidence(),
          data: reward,
        },
      })),
    );
  }

  public addFeedback(to: string[], reward: Reward<RewardT>): void {
    throw new Error('addFeedback() is not implemented.');
  }

  public sendAction(userAction: ActionT): void {
    const action = new ActionPb();
    action.setContent(userAction.serializeBinary());
    const request = new TrialActionRequest();
    request.setAction(action);
    this.actionStreamClient.send(request);
  }

  public async *eventLoop(): AsyncGenerator<
    Event<ObservationPb, RewardPb, MessagePb>
  > {
    warning(!this.running, 'Trial is not currently running.');
    while (this.running) {
      if (this.events[0]) {
        yield this.events.splice(0, 1)[0];
      } else {
        logger.trace('No events available, sleeping 200ms');
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  public getActiveActors(): TrialActor[] {
    throw new Error('getActiveActors() is not implemented');
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

  public sendMessage(to: string[], message: MessageT): void {
    throw new Error('sendMessage() is not implemented');
  }

  public stop(): void {
    this.running = false;
  }

  public start(): void {
    this.running = true;
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
}
