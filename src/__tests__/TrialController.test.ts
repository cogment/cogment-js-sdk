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
import cogSettings from '../../__tests__/end-to-end/cogment-app/clients/web/src/cog_settings';
import {createService} from '../Cogment';
import {VersionInfo, VersionRequest} from '../cogment/api/common_pb';
import {
  TerminateTrialReply,
  TerminateTrialRequest,
  TrialInfoRequest,
  TrialStartReply,
  TrialStartRequest,
  TrialState,
} from '../cogment/api/orchestrator_pb';
import {TrialController} from '../TrialController';

describe('TrialController', () => {
  describe('when given an invalid orchestrator url', () => {
    test('fails to make a request to orchestrator', () => {
      const transport = NodeHttpTransport();
      const service = createService(
        {...cogSettings, connection: {http: 'http://example.com'}},
        transport,
      );

      const trialController = service.createTrialController();
      const request = new VersionRequest();
      return expect(trialController.version(request)).rejects.toBeInstanceOf(
        Error,
      );
    });
  });

  describe('can request `VersionInfo` from orchestrator', () => {
    test.each([
      ['NodeHttpTransport', NodeHttpTransport()],
      ['WebsocketTransport', grpc.WebsocketTransport()],
    ])('with a %s', (description, transport) => {
      const service = createService(cogSettings, transport);
      const trialController = service.createTrialController();
      const request = new VersionRequest();
      return trialController.version(request).then((response) => {
        expect(response).toBeInstanceOf(VersionInfo);
        expect(response.getVersionsList().length).toBeGreaterThan(0);
      });
    });
  });

  test('can execute a trial', () => {
    const clientName = cogSettings.actor_classes.emma.id;
    const transport = NodeHttpTransport();
    const service = createService(cogSettings, transport);

    const trialController = service.createTrialController();

    const trialStartRequest = new TrialStartRequest();
    trialStartRequest.setUserId(clientName);

    return trialController.startTrial(trialStartRequest).then((response) => {
      const trialId = response.getTrialId();

      expect(response).toBeInstanceOf(TrialStartReply);
      expect(trialId).toBeTruthy();
      expect(response.toObject().actorsInTrialList).toEqual(
        expect.arrayContaining([{actorClass: 'emma', name: 'emma'}]),
      );
      return trialController
        .getTrialInfo(new TrialInfoRequest(), trialId)
        .then((trialInfo) => {
          expect(trialInfo.toObject().trialList).toContainEqual(
            expect.objectContaining({
              trialId,
              state: TrialState.PENDING,
            }),
          );
          const terminateTrialRequest = new TerminateTrialRequest();
          return trialController.terminateTrial(terminateTrialRequest, trialId);
        })
        .then((response) => {
          expect(response).toBeInstanceOf(TerminateTrialReply);
        });
    });
  });
});
