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
import {
  TrialLifecycle,
  TrialLifecycleClient,
} from './cogment/api/orchestrator_pb_service';
import {CogmentClient} from './CogmentClient';

const ORCHESTRATOR_URL = 'orchestrator:9000';

const transport = grpc.WebsocketTransport();
const trialLifecycleClient = new TrialLifecycleClient(ORCHESTRATOR_URL, {
  transport,
});
const client = grpc.client(TrialLifecycle.Version, {
  host: ORCHESTRATOR_URL,
  transport,
});
client.onMessage((req) => (req: grpc.ProtobufMessage) => {
  console.log('Got a messagee!');
  console.log(req);
});
///const grpcWebServer = transport({
//  methodDefinition: (req: any) => {},
//  debug: true,
//  onChunk(chunkBytes: Uint8Array, flush: boolean | undefined): void {},
//  onEnd(err: Error | undefined): void {},
//  onHeaders(headers: Metadata, status: number): void {},
//  url: '/_socket',
//});

const orchestratorClient = new CogmentClient(trialLifecycleClient);

orchestratorClient
  .version()
  .then((versionInfo) => {
    console.log('Got something!');
    console.log(versionInfo);
  })
  .catch((err: Error) => {
    console.error(`${err}\n${err.stack}`);
  });
