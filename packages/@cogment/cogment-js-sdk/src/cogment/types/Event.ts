/*
 *  Copyright 2021 AI Redefined Inc. <dev+cogment@ai-r.com>
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

import {CogMessage} from './CogMessage';
import {MessageBase} from './UtilTypes';

/**
 * The type of an incoming event, representing the state of the trial.
 */
export enum EventType {
  NONE = 0,
  ACTIVE = 1,
  ENDING = 2,
  FINAL = 3,
}

/**
 * An event received from the Cogment framework.
 * @typeParam ObservationT - Protobuf message type of the observation space.
 * @typeParam FeedbackT - Protobuf message type of the feedback space.
 */
export interface Event<
  ObservationT extends MessageBase,
  FeedbackT extends MessageBase,
> {
  /**
   * The next message encoded as a protobuf message.
   */
  message?: CogMessage;
  /**
   * The next observation from the environment encoded as a protobuf message.
   */
  observation?: ObservationT;
  /**
   * The next reward encoded as a protobuf message.
   */
  reward?: FeedbackT;
  /**
   * The tick id of this event.
   */
  tickId?: number;
  /**
   * Epoch timestamp in milliseconds when this event was generated by the Cogment framework.
   */
  timestamp?: number;
  /**
   * The trial state at the tick id of this event.
   */
  type?: EventType;
}
