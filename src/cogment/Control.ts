import {BrowserHeaders} from 'browser-headers';
import {streamToGenerator} from '../lib/Utils';
import {
  TrialConfig,
  TrialState as TrialStateMsg,
  TrialStateMap,
  VersionRequest,
} from './api/common_pb';
import {
  TerminateTrialRequest,
  TrialInfoRequest,
  TrialListRequest,
  TrialStartRequest,
} from './api/orchestrator_pb';
import {TrialLifecycleSPClient} from './api/orchestrator_pb_service';
import {CogSettings} from './types';
import {MessageBase} from './types/UtilTypes';

export enum TrialState {
  UNKNOWN = TrialStateMsg.UNKNOWN,
  INITIALIZING = TrialStateMsg.INITIALIZING,
  PENDING = TrialStateMsg.PENDING,
  RUNNING = TrialStateMsg.RUNNING,
  TERMINATING = TrialStateMsg.TERMINATING,
  ENDED = TrialStateMsg.ENDED,
}

export class TrialInfo {
  public envName?: string;
  public tickId?: number;
  public duration?: number;
  constructor(public trialId: string, public state: TrialState) {}
}

export class Controller {
  constructor(
    private cogSettings: CogSettings,
    private lifecycleStub: TrialLifecycleSPClient,
    public userId: string,
  ) {}

  getActors = async (trialId: string) => {
    const req = new TrialInfoRequest();
    req.setGetActorList(true);
    const metadata = new BrowserHeaders({'trial-id': trialId});

    return new Promise((resolve, reject) => {
      this.lifecycleStub.getTrialInfo(req, metadata, (err, rawRep) => {
        if (err) {
          reject(err);
        } else {
          const rep = rawRep?.toObject();
          if (!rep) {
            reject(new Error('No response from server'));
            return;
          }

          return rep.trialList[0].actorsInTrialList as {
            name: string;
            actorClass: string;
          }[];
        }
      });
    });
  };

  startTrial = async (trialConfig?: MessageBase, trialIdRequested?: string) => {
    const req = new TrialStartRequest();
    req.setUserId(this.userId);
    if (trialConfig) {
      const config = new TrialConfig();
      config.setContent(
        this.cogSettings.trial.config.encode(trialConfig).finish(),
      );
      req.setConfig(config);
    }
    if (trialIdRequested) req.setTrialIdRequested(trialIdRequested);

    return new Promise<string>((resolve, reject) => {
      this.lifecycleStub.startTrial(req, (err, rawRep) => {
        if (err) {
          reject(err);
        } else {
          const rep = rawRep?.toObject();
          if (!rep) {
            reject(new Error('No response from server'));
            return;
          }

          resolve(rep.trialId);
        }
      });
    });
  };

  terminateTrial = async (trialIds: string[], hard = false) => {
    const req = new TerminateTrialRequest();
    req.setHardTermination(hard);

    const trialIdMetadata = new BrowserHeaders({'trial-id': trialIds});
    return new Promise<boolean>((resolve, reject) => {
      this.lifecycleStub.terminateTrial(req, trialIdMetadata, (err, rawRep) => {
        if (err) {
          reject(err);
        } else {
          const rep = rawRep?.toObject();
          if (!rep) {
            reject(new Error('No response from server'));
            return;
          }

          resolve(true);
        }
      });
    });
  };

  getTrialInfo = (trialIds: string[]) => {
    const req = new TrialInfoRequest();
    const trialIdMetadata = new BrowserHeaders({'trial-id': trialIds});
    return new Promise<TrialInfo[]>((resolve, reject) => {
      this.lifecycleStub.getTrialInfo(req, trialIdMetadata, (err, rawRep) => {
        if (err) {
          reject(err);
        } else {
          const rep = rawRep?.toObject();
          if (!rep) {
            reject(new Error('No response from server'));
            return;
          }

          const result = rep.trialList.map((trial) => {
            const trialInfo = new TrialInfo(trial.trialId, trial.state);
            if (trial.envName) {
              trialInfo.envName = trial.envName;
            }
            if (trial.tickId) {
              trialInfo.tickId = trial.tickId;
            }
            if (trial.trialDuration) {
              trialInfo.duration = trial.trialDuration;
            }
            return trialInfo;
          });

          resolve(result);
        }
      });
    });
  };

  async *watchTrials(
    trialStateFilters: TrialStateMap[keyof TrialStateMap][] = [],
  ) {
    const request = new TrialListRequest();
    request.setFilterList(trialStateFilters);

    const watchTrialsStream = this.lifecycleStub.watchTrials(request);
    const generator = streamToGenerator(watchTrialsStream);

    for await (let reply of generator()) {
      if (!reply) break;
      const info = new TrialInfo(reply.getTrialId(), reply.getState());
      yield info;
    }
  }

  getRemoteVersions = () => {
    const request = new VersionRequest();
    this.lifecycleStub.version(request, (err, rawRep) => {
      if (err) {
        throw err;
      } else {
        const rep = rawRep?.toObject();
        if (!rep) {
          throw new Error('No response from server');
        }
        const result: {[key: string]: string} = {};
        rep.versionsList.forEach((version) => {
          result[version.name] = version.version;
        });
        return result;
      }
    });
  };
}
