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

import {ActorEndpointClient} from './cogment/api/orchestrator_pb_service';
import {Event} from './Event';
import {Reward} from './Reward';
import {TrialActor} from './TrialActor';

export class ActorSession<
  ActionT = never,
  ObservationT = never,
  RewardT = never,
  MessageT = never
> {
  constructor(private actorEndpointClient: ActorEndpointClient) {}
  public addFeedback(to: string[], reward: Reward<RewardT>): void {
    throw new Error('addFeedback() is not implemented.');
  }

  public doAction(action: ActionT): void {
    throw new Error('doAction() is not implemented');
  }

  public eventLoop(): AsyncIterator<Event<ObservationT, RewardT, MessageT>> {
    throw new Error('eventLoop() is not implemented');
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

  public start(): void {
    throw new Error('start() is not implemented.');
  }
}
