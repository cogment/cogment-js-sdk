import { Action } from "./api/common_pb"
import { ActorImplementation } from "./Context"
import { Session } from "./Session"
import { Trial } from "./Trial"
import { CogSettingsActorClass } from "./types"
import { MessageBase } from "./types/UtilTypes"

export class ActorSession<ActionT extends MessageBase, ObservationT extends MessageBase> extends Session<ActionT, ObservationT> {
    public className: string;

    constructor(
        impl: ActorImplementation<ActionT, ObservationT>,
        public _actorClass: CogSettingsActorClass,
        trial: Trial,
        name: string,
        public envName: string,
        public config?: MessageBase
    ) {
        super(trial, name, impl, config)
        this.className = _actorClass.name
    }

    public start = (autoDoneSending = true) => {
        this._start(autoDoneSending)
    }

    public doAction = (action?: ActionT) => {
        const actionReq = new Action()
        actionReq.setTimestamp(Date.now() * 1000);
        actionReq.setTickId(-1);
        if (action)
            actionReq.setContent(this._actorClass.actionSpace.encode(action).finish())

        this._postData(actionReq)
    }
}