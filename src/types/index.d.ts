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

import * as cogSettings from './cog_settings.js';

type CogSettings = typeof cogSettings;

interface Cogment {
  createService: (cogSettings: CogSettings) => CogmentService;
}

// TODO: What other values for name and classes will there be for
//        cogment 1.0? No support for agents is planned yet.
type HumanActorConfig = {name: 'human'; classes: ['player']};
type ActorConfig = {name: string; classes: string[]};
type ActorImplementation = (session: ActorSession) => Promise<void>;
type CogmentMessage = any;
type MessageHandler = (message: CogmentMessage) => Promise<void>;

interface StartTrialArgs {
  config: TrialConfig;
}
interface StartTrialReturnType {
  actors: ActorConfig[];
  trialId: string;
}
interface JoinTrialArgs {
  actorId: 0;
  actorImplName: 'human';
  trialId: string;
}

interface CogmentService {
  registerActor: (
    actorConfig: ActorConfig,
    actorImpl: ActorImplementation,
  ) => void;
}

interface TrialController {
  joinTrial: (args: JoinTrialArgs) => Promise<void>;
  startTrial: (args: StartTrialArgs) => Promise<StartTrialReturnType>;
  terminateTrial: (trialId: string) => Promise<void>;
}

interface TrialActor {
  name: string;
  class: string;
}

interface Reward<RewardT> {
  tickId: number;
  value: number;
  confidence: number;
  data: RewardT;
}

interface Event<ObservationT, RewardT, MessageT> {
  observation: ObservationT;
  reward: Reward<RewardT>;
  message: {
    sender: string;
    data: MessageT;
  };
}

interface ActorSession<ActionT, ObservationT, RewardT, MessageT> {
  getTriaId: () => string;
  getTickId: () => number;
  getActiveActors: () => Array<TrialActor>;
  isTrialOver: () => boolean;
  start: () => void;
  eventLoop: () => AsyncIterator<Event<ObservationT, RewardT, MessageT>>;
  doAction: (action: ActionT) => void;
  sendMessage: (to: Array<string>, message: MessageT) => void;
  addFeedback: (to: Array<string>, reward: Reward<RewardT>) => void;
}
