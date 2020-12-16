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
import * as jspb from 'google-protobuf';
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
import {
  TrialActionReply,
  TrialActionRequest,
} from './cogment/api/orchestrator_pb';
import {ActorEndpointClient} from './cogment/api/orchestrator_pb_service';
import {logger} from './lib/Logger';

export class ActorSession<
  ActionT extends jspb.Message,
  ObservationT extends jspb.Message,
  RewardT extends jspb.Message,
  MessageT extends jspb.Message
> {
  private running = false;
  private events: Event<ObservationPb, RewardPb, MessagePb>[] = [];

  constructor(
    private actorEndpointClient: ActorEndpointClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {
    this.actionStreamClient.onMessage(this.onActionStreamMessage.bind(this));
  }

  private onActionStreamMessage(action: TrialActionReply) {
    const data = action.getData();
    if (!data) {
      return logger.warn('Received an action without any data');
    }

    // Assumes data received is all newer than the last received tickId
    const observations = sortBy(data.getObservationsList(), ({getTickId}) =>
      getTickId(),
    );
    const messages = sortBy(data.getMessagesList(), ({getTickId}) =>
      getTickId(),
    );
    const rewards = data.getRewardsList();

    // TODO: Do we need to worry about ordering received observations, rewards, messages by tickId?
    concat(
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
    while (true) {
      if (!this.running) {
        logger.error(
          'eventLoop() running and not currently running, sleeping 200ms',
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
        continue;
      }
      if (this.events[0]) {
        yield this.events.splice(0, 1)[0];
      } else {
        logger.info('No events available, sleeping 200ms');
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
}
