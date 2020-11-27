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

import {CogmentClient} from './CogmentClient';
import {TrialLifecycleClient} from './cogment/api/orchestrator_pb_service';

const ORCHESTRATOR_URL = 'orchestrator:9000';
const trialLifecycleClient = new TrialLifecycleClient(ORCHESTRATOR_URL);
const orchestratorClient = new CogmentClient(trialLifecycleClient);

console.log('oh hai!');

orchestratorClient
  .version()
  .then((versionInfo) => {
    console.log('Got something!');
    console.log(versionInfo);
  })
  .catch((err: Error) => {
    console.error(`${err}\n${err.stack}`);
  });

const sum = (a: number, b: number) => a + b;

export {sum};
