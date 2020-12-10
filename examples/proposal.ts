import {createService} from 'cogment';

import cog_settings from './cog_settings';

import {ROCK, PAPER, SCISSORS, TrialConfig} from './data-pb2';

const service = cogment.createService({
  settings: cog_settings,
});

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
