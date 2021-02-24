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

import {createService} from 'cogment';

import cogSettings from './CogSettings';

import {ROCK, PAPER, SCISSORS, TrialConfig} from './data_pb2';

const service = createService(cogSettings);

service.registerActor(
  {name: 'human', classes: ['player']},
  async (actorSession) => {
    actorSession.start();

    for await (const {observation, reward, message} of actorSession.run()) {
      if (observation != null) {
        document.querySelector('.p1Score').innerHTML = observation.p1_score;
        document.querySelector('.p1Score').innerHTML = observation.p2_score;
        const move = await new Promise((resolve) => {
          const playRock = () => {
            document
              .querySelector('button.rock')
              .removeEventListener('click', playRock);

            resolve(ROCK);
          };
          document
            .querySelector('button.rock')
            .addEventListener('click', playRock);

          // [...]
        });
        actorSession.doAction(move);
      }
      if (message != null) {
        if (message.payload == 'windy') {
          document.querySelector('button.paper').disabled = true;
        } else {
          document.querySelector('button.paper').disabled = false;
        }
      }

      if (reward != null) {
        document.querySelector('.reward').innerHTML =
          reward.value * reward.confidence;
      }
    }
  },
);

const trialController = service.createTrialController(
  '[http://orchestrator-gateway:9000](http://orchestrator-gateway:9000)',
);

const {trialId, actors} = await trialController.startTrial({
  config: new TrialConfig(),
});

document
  .querySelector('button.terminate')
  .addEventListener(
    'click',
    async () => await trialController.terminateTrial(trialId),
  );
await trialController.joinTrial({
  trialId,
  actorImplName: 'human',
  actorId: 0,
});
