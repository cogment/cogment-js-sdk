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
  Context,
  MessageBase,
  Reward,
  TrialInfo,
  TrialState,
} from '../../src';
import {config} from '../../src/lib/Config';
import {cogSettings} from './cogment-app/webapp/src/CogSettings';
import {cogment_app as PB} from './cogment-app/webapp/src/data_pb';

describe('a cogment-app', () => {
  const observations: PB.Observation[] = [];
  const messagesList: MessageBase[] = [];
  const rewardsList: Reward[] = [];
  let trialId: string;
  let trialInfos: TrialInfo[];
  let trialInfosAfterTermination: TrialInfo[];
  let watchTrialsResponse: TrialInfo;

  test('runs', async () => {
    let resolve = () => {};
    const promise = new Promise<void>((_resolve) => {
      resolve = _resolve;
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
      } of actorSession.eventLoop()) {
        if (observation) {
          observations.push(observation);
          const action = new PB.ClientAction();
          action.request = 'ping';
          iterations++;
          if (iterations >= 100) {
            resolve();
            return;
          }
          actorSession.doAction(action);
          const message = new PB.Message();
          message.request = 'foo';

          actorSession.sendMessage(message, ['echo_echo_1']);
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
    };

    const context = new Context<PB.ClientAction, PB.Observation>(
      cogSettings,
      'test_client',
    );
    context.registerActor(pingActor, 'client_actor', 'client');

    const controller = context.getController(config.connection.http);
    trialId = await controller.startTrial();

    await context.joinTrial(trialId, config.connection.http, 'client_actor');
    await promise;
    for await (let response of controller.watchTrials()) {
      watchTrialsResponse = response;
      trialInfos = await controller.getTrialInfo([response.trialId]);
      break;
    }
    const termination = await controller.terminateTrial([trialId]);
    console.log(termination);
    trialInfosAfterTermination = await controller.getTrialInfo([trialId]);
    return;
  });

  test('Receives observations', async () => {
    expect(observations).not.toHaveLength(0);
  });

  test('Receives messages', async () => {
    expect(messagesList).not.toHaveLength(0);
  });

  test('Observations are correct', async () => {
    expect(observations[2].response).toBe('pingfoo');
  });

  test('WatchTrials gives a response', async () => {
    expect(watchTrialsResponse.trialId).toBe(trialId);
    expect(watchTrialsResponse.state).toBe(TrialState.RUNNING);
  });

  test('trialInfo is correct', async () => {
    expect(trialInfos.length).toBe(1);
    expect(trialInfos[0].trialId).toBe(trialId);
    expect(trialInfos[0].state).toBe(TrialState.RUNNING);
    expect(trialInfos[0].tickId).toBe(99);
  });

  test('expect trial to terminate', async () => {
    console.log(trialInfosAfterTermination);
    expect(trialInfosAfterTermination.length).toBe(0);
  });
});
