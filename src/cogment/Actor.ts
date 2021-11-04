import { Message } from "google-protobuf"
import { Action } from "./api/common_pb"
import { ActorImplementation } from "./Context"
import { Session } from "./Session"
import { Trial } from "./Trial"
import { CogSettingsActorClass } from "./types"
import { MessageBase } from "./types/UtilTypes"

export class ActorSession<ActionT extends MessageBase, ObservationT extends MessageBase> extends Session<ActionT, ObservationT> {
    public className: string;

    constructor(
            impl: ActorImplementation<MessageBase, MessageBase>, 
            private _actorClass: CogSettingsActorClass, 
            trial: Trial,
            name: string, 
            public envName: string, 
            config: MessageBase
        ){
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
    public sendMessage = (payload: Message, to, toEnvironment?: boolean) => {
        if to_environment is not None:
            logging.warning("Parameter 'to_environment' is deprecated for 'send_message' method. "
                            "Use 'this.env_name' as environment name in the 'to' parameter.")
            if to_environment:
                this._sendMessage(payload, to + [this.env_name])
                return
        this._send_message(payload, to)
    }
}