import {CogmentClient} from './CogmentClient';
import {TrialLifecycleClient} from './protos/orchestrator_pb_service';

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
