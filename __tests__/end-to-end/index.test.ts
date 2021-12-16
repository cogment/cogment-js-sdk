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
import {
  ActorSession,
  AnyPB,
  Context,
  Controller,
  EventType,
  MessageBase,
  Reward,
  TrialInfo,
  TrialState
} from '../../src';
import { cogSettings } from './cogment-app/webapp/src/CogSettings';
import { cogment_app as PB } from './cogment-app/webapp/src/data_pb';

const sleep = (millis: number) => {
  return new Promise((resolve) => window.setTimeout(resolve, millis));
};

const ORCHESTRATOR_URL =
  process.env.ORCHESTRATOR_URL || 'http://grpcwebproxy:8081';

console.log(`ORCHESTRATOR_URL: ${ORCHESTRATOR_URL}`);

describe('a cogment-app', () => {
  const observations: PB.Observation[] = [];
  const messagesList: (MessageBase | AnyPB)[] = [];
  const rewardsList: Reward[] = [];
  let trialId: string;
  let trialInfos: TrialInfo[];
  let trialInfosAfterTermination: TrialInfo[];
  

  
  let trialMiddleResolve = () => { };
  const trialMiddlePromise = new Promise<void>((resolve) => {
    trialMiddleResolve = resolve;
  });
  let trialEndResolve = () => { };
  const trialEndPromise = new Promise<void>((resolve) => {
    trialEndResolve = resolve;
  });
  let trialTerminateResolve = () => { };
  const trialTerminatePromise = new Promise<void>((resolve) => {
    trialTerminateResolve = resolve;
  });

  const pingActor = async (
    actorSession: ActorSession<PB.ClientAction, PB.Observation>,
  ) => {
    actorSession.start();

    let iterations = 0;

    const action = new PB.ClientAction();
    action.request = 'ping';
    actorSession.doAction(action);

    for await (const {
      observation,
      messages,
      rewards,
      type,
    } of actorSession.eventLoop()) {
      if (observation) {
        observations.push(observation);
        const action = new PB.ClientAction();
        action.request = 'ping';
        iterations++;
        if (iterations === 10) {
          console.log("Resolving middle promise");
          trialMiddleResolve();
        }
        if (iterations === 20) {
          console.log("Resolving end promise");
          trialEndResolve();
        }

        const message = new PB.Message();
        message.request = 'foo';
        if (type !== EventType.ENDING && type !== EventType.FINAL) {
          actorSession.sendMessage(message, ['echo_echo_1']);
          actorSession.doAction(action);
        }
      }
      if (messages.length) {
        messages.forEach((message) => {
          messagesList.push(message);
        });
      }

      if (rewards.length) {
        rewardsList.push(...rewards);
      }
    }
    trialTerminateResolve();
  };

  let context: Context<PB.ClientAction, PB.Observation>;
  test('actor registers', async () => {
    context = new Context<PB.ClientAction, PB.Observation>(
      cogSettings,
      'test_client',
    );
    context.registerActor(pingActor, 'client_actor', 'client');
  })

  let controller: Controller;
  test('gets controller', async () => {
    controller = context.getController(ORCHESTRATOR_URL);
  })
  test('starts trial', async () => {
    trialId = await controller.startTrial();

  });
  test('joins trial', async () => {
    await context.joinTrial(trialId, ORCHESTRATOR_URL, 'client_actor');
  });
  test('gets trial info', async () => {
    await trialMiddlePromise;
    trialInfos = await controller.getTrialInfo([trialId]);
  });

  test('Trial terminates', async () => {
    await trialEndPromise;
    await controller.terminateTrial([trialId], false);
  })

  test('gets trial info after termination', async () => {
    await trialTerminatePromise;
    trialInfosAfterTermination = await controller.getTrialInfo([trialId]);
  });

  test('Received observations', async () => {
    expect(observations).not.toHaveLength(0);
  });

  test('Received messages', async () => {
    expect(messagesList).not.toHaveLength(0);
  });

  test('Observations are correct', async () => {
    expect(observations[2].response).toBe('pingfoo');
  });

  test('TrialInfo is correct', async () => {
    expect(trialInfos.length).toBe(1);
    const thisTrial = trialInfos.find((trial) => trial.trialId === trialId);
    expect(thisTrial).toBeDefined();
    if (!thisTrial) return;
    expect(thisTrial.trialId).toBe(trialId);
    expect(thisTrial.state).toBe(TrialState.RUNNING);
    expect(thisTrial.tickId).toBeGreaterThanOrEqual(9);
  });

  

  test('Trial termination was correct', async () => {
    
    const noTrials = trialInfosAfterTermination.length === 0;

    const thisTrial = trialInfosAfterTermination.find((trial) => trial.trialId === trialId);
    const ended = thisTrial?.state === TrialState.ENDED;

    console.log(trialInfosAfterTermination, noTrials, thisTrial)
    expect(noTrials || ended).toBe(true);
  });
});
