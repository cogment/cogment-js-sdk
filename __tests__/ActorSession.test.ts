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
import {Any as AnyPb} from 'google-protobuf/google/protobuf/any_pb';
import {createService} from '../src';
import {TrialMessageReply} from '../src/cogment/api/orchestrator_pb';
import {config} from '../src/cogment/lib/Config';
import {getLogger} from '../src/cogment/lib/Logger';
import {TrialActor} from '../src/types';
import {cogSettings} from './end-to-end/cogment-app/webapp/src/CogSettings';
import {
  ClientAction,
  EnvConfig as EnvironmentConfig,
  Message,
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
  let lastMessage: Message;
  let sendMessagePromise: Promise<TrialMessageReply.AsObject>;

  beforeAll(async () => {
    const cogmentService = createService({
      cogSettings,
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

    cogmentService.registerActor<ClientAction, Observation, never>(
      trialActor,
      async (actorSession) => {
        logger.info('Actor running');
        actorSession.start();
        logger.info('Actor session started');

        setTimeout(actorSession.stop.bind(actorSession), 500);

        const action = new ClientAction();
        actorSession.sendAction(action);

        for await (const {
          observation,
          message: cogMessage,
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
          if (cogMessage) {
            lastMessage = new Message();
            const newMessage = cogMessage.data?.unpack<Message>(
              (x: Uint8Array) => Message.deserializeBinary(x),
              'cogment_app.Message',
            );
            if (newMessage) {
              lastMessage = newMessage;
              logger.info(
                `Received a message for tick id ${
                  tickId ?? ''
                }: ${JSON.stringify(lastMessage.toObject(), undefined, 2)}`,
              );
            }
          }
          if (tickId !== undefined && tickId !== null && tickId >= 0) {
            lastTickId = tickId;
            tickIds.push(tickId);

            if (!(tickId % 2)) {
              const message = new Message();
              const anyPb = new AnyPb();
              message.setRequest(TEST_MESSAGE);

              anyPb.pack(message.serializeBinary(), 'cogment_app.Message');
              sendMessagePromise = actorSession.sendMessage({
                from: trialActor.name,
                payload: anyPb,
                to: 'echo_echo_1',
                trialId,
              });
            }
          }
        }
      },
    );

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

    test('receives an incrementing tickId', () => {
      expect(lastTickId).toBeGreaterThan(0);
    });

    test('tickIds are ordered', () => {
      for (let tickIndex = 0; tickIndex < tickIds.length - 1; tickIndex++) {
        expect(tickIds[tickIndex]).toBeLessThan(tickIds[tickIndex + 1]);
      }
    });

    test('observation contains a timestamp from the environment', () => {
      expect(lastTimestamp).not.toBe(0);
      expect(lastTimestamp).not.toEqual('');
      expect(lastTimestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('#sendAction', () => {
    describe('when passed an action that contains an echo request', () => {
      test('observation contains the echo response', () => {
        expect(lastResponse).toMatch(new RegExp(`^${TEST_MESSAGE}`));
      });
    });
  });

  describe('#joinTrial', () => {
    describe('when passed a trialConfig', () => {
      test('configurator passes trialConfig to the environment', () => {
        expect(lastResponse).toEqual(`${TEST_MESSAGE}${SUFFIX}`);
      });
    });
  });

  describe('#sendMessage', () => {
    test('succeeds', async () => {
      await expect(sendMessagePromise).resolves.toBeTruthy();
    });

    test('echo agent echos a message', () => {
      expect(lastMessage.toObject()).toMatchObject({
        request: '',
        response: TEST_MESSAGE,
      });
    });
  });
});
