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
import {NodeHttpTransport} from '@improbable-eng/grpc-web-node-http-transport';
import {createService} from '../src';
import {TrialMessageReply} from '../src/cogment/api/orchestrator_pb';
import {config} from '../src/cogment/lib/Config';
import {getLogger} from '../src/cogment/lib/Logger';
import {SendMessageReturnType} from '../src/cogment/TrialController';
import {TrialActor} from '../src/types';
import cogSettings from './end-to-end/cogment-app/webapp/src/cog_settings';
import {
  ClientAction,
  ClientMessage,
  EnvConfig as EnvironmentConfig,
  Observation,
  TrialConfig,
} from './end-to-end/cogment-app/webapp/src/data_pb';

const logger = getLogger('ActorSession');

describe('ActorSession', () => {
  const TEST_MESSAGE = 'foo';
  const SUFFIX = ' bar';

  let tickIds: number[] = [];
  let lastObservation: Observation;
  let lastTimestamp: number;
  let lastResponse: string;
  let lastTickId: number;
  let lastMessage;
  let sendValidMessagePromise: Promise<TrialMessageReply.AsObject>;
  let sendInvalidMessagePromise: Promise<SendMessageReturnType>;

  beforeAll(async () => {
    const cogmentService = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: NodeHttpTransport(),
      streamingTransportFactory: grpc.WebsocketTransport(),
    });

    // TODO: this fails if run before registerActor
    // const trialController = service.createTrialController(trialLifecycleClient);

    const trialActor: TrialActor = {
      name: 'client_actor',
      actorClass: 'client',
    };

    cogmentService.registerActor<
      ClientAction,
      Observation,
      never,
      ClientMessage
    >(trialActor, async (actorSession) => {
      logger.info('Actor running');
      actorSession.start();
      logger.info('Actor session started');

      setTimeout(actorSession.stop.bind(actorSession), 500);

      const action = new ClientAction();

      //Send 10 actions so that we can see if they come back ordered
      for (let i = 0; i < 10; i++) {
        action.setRequest(TEST_MESSAGE);
        actorSession.sendAction(action);
      }

      for await (const {
        observation,
        message,
        tickId,
      } of actorSession.eventLoop()) {
        if (observation) {
          const response = observation.getResponse();
          const timestamp = observation.getTimestamp();
          logger.info(
            `Received an observation for tick id ${
              tickId ?? ''
            }: ${JSON.stringify(observation.toObject(), undefined, 2)}`,
          );
          if (timestamp) {
            lastTimestamp = timestamp;
          }
          if (response) {
            lastResponse = response;
          }
          lastObservation = observation;
          const action = new ClientAction();
          action.setRequest(TEST_MESSAGE);
          actorSession.sendAction(action);
        }
        if (message) {
          logger.info(
            `Received a message for tick id ${tickId ?? ''}: ${JSON.stringify(
              message,
              undefined,
              2,
            )}`,
          );
          lastMessage = message;
        }
        if (tickId) {
          lastTickId = tickId;
          tickIds.push(tickId);

          // if (false && !(tickId % 10)) {
          //   const clientMessage = new ClientMessage();
          //   clientMessage.setRequest('oh hai!');
          //   sendValidMessagePromise = actorSession.sendMessage<ClientMessage>(
          //     {
          //       actorName: trialActor.name,
          //       from: trialActor.name,
          //       payload: clientMessage,
          //       to: 'echo_echo_1',
          //       trialId,
          //     },
          //   );
          //   sendInvalidMessagePromise = actorSession.sendMessage<ClientMessage>(
          //     {
          //       actorName: trialActor.name,
          //       from: trialActor.name,
          //       payload: clientMessage,
          //       to: 'newp',
          //       trialId,
          //     },
          //   );
          // }
        }
      }
    });

    const trialController = cogmentService.createTrialController();

    const trialConfig = new TrialConfig();
    const environmentConfig = new EnvironmentConfig();
    environmentConfig.setSuffix(SUFFIX);
    trialConfig.setEnvConfig(environmentConfig);

    const {trialId} = await trialController.startTrial(
      trialActor.name,
      trialConfig,
    );
    await trialController.joinTrial(trialId, trialActor);
    // eslint-disable-next-line compat/compat
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return trialController.terminateTrial(trialId);
  });

  describe('#eventLoop', () => {
    test('receives observations', () => {
      expect(lastObservation).toBeInstanceOf(Observation);
    });

    test('tickIds are ordered', () => {
      for (let tickIndex = 0; tickIndex < tickIds.length - 1; tickIndex++) {
        expect(tickIds[tickIndex] <= tickIds[tickIndex + 1]).toBe(true)
      }
    });

    test('observation contains a timestamp from the environment', () => {
      expect(lastTimestamp).not.toBe(0);
      expect(lastTimestamp).not.toEqual('');
      expect(lastTimestamp).toBeLessThanOrEqual(Date.now());
    });

    test('observation contains an incrementing tickId', () => {
      expect(lastTickId).toBeGreaterThan(0);
    });
  });

  describe('#sendMessage', () => {
    describe('when passed a message', () => {
      test('observation.response contains the message', () => {
        expect(lastResponse).toMatch(new RegExp(`^${TEST_MESSAGE}`));
      });
    });
  });

  describe('#joinTrial', () => {
    describe('when passed a trialConfig', () => {
      test('the trialConfig is passed to the backend', () => {
        expect(lastResponse).toEqual(`${TEST_MESSAGE}${SUFFIX}`);
      });
    });
  });

  describe.skip('#sendMessage', () => {
    describe('when given a valid recipient', () => {
      test('resolves', async () => {
        await expect(sendValidMessagePromise).resolves.toBeTruthy();
      });
    });

    describe('when given an invalid recipient', () => {
      test('rejects', async () => {
        await expect(sendInvalidMessagePromise).rejects.toBeTruthy();
      });
    });
  });
});
