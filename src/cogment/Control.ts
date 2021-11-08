import { Metadata } from "@improbable-eng/grpc-web/dist/typings/metadata";
import { MessageBase } from ".";
import { TrialConfig, TrialStateMap } from "./api/common_pb";
import { TerminateTrialRequest, TrialInfoRequest, TrialStartRequest } from "./api/orchestrator_pb";
import { TrialLifecycleSPClient } from "./api/orchestrator_pb_service";
import { CogSettings } from "./types";




class TrialInfo {
    public envName?: string;
    public tickId?: number;
    public duration?: number;

    constructor(public trialId: string, public apiState: TrialStateMap) { }
}


export class Controller {
    constructor(private _cogSettings: CogSettings, private _lifecycleStub: TrialLifecycleSPClient, public userId: string) { }

    getActors = async (trialId: string) => {
        const req = new TrialInfoRequest()
        req.setGetActorList(true)
        const metadata = new Metadata({ "trial-id": trialId })

        return new Promise((resolve, reject) => {
            this._lifecycleStub.getTrialInfo(req, metadata, (err, _rep) => {
                if (err) {
                    reject(err)
                } else {
                    const rep = _rep?.toObject();
                    if (!rep) {
                        reject(new Error("No response from server"))
                        return;
                    }

                    return rep.trialList[0].actorsInTrialList as { name: string, actorClass: string }[]
                }
            })
        })

    }

    startTrial = async (trialConfig?: MessageBase, trialIdRequested?: string) => {
        const req = new TrialStartRequest()
        req.setUserId(this.userId)
        if (trialConfig) {
            const config = new TrialConfig()
            config.setContent(this._cogSettings.trial.config.encode(trialConfig).finish())
            req.setConfig()
        }
        if (trialIdRequested)
            req.setTrialIdRequested(trialIdRequested)

        return new Promise<string>((resolve, reject) => {
            this._lifecycleStub.startTrial(req, (err, _rep) => {
                if (err) {
                    reject(err)
                } else {
                    const rep = _rep?.toObject();
                    if (!rep) {
                        reject(new Error("No response from server"))
                        return;
                    }

                    resolve(rep.trialId)
                }
            })
        })
    }

    terminateTrial = async (trialIds: string[], hard = false) => {
        const req = new TerminateTrialRequest()
        req.setHardTermination(hard);

        const trialIdMetadata = new Metadata({ "trial-id": trialIds })
        return new Promise((resolve, reject) => {
            this._lifecycleStub.terminateTrial(req, trialIdMetadata, (err, _rep) => {
                if (err) {
                    reject(err)
                } else {
                    const rep = _rep?.toObject();
                    if (!rep) {
                        reject(new Error("No response from server"))
                        return;
                    }

                    resolve(rep)
                }
            })
        })
    }
}