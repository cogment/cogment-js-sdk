import {CogSettings, CogSettingsActorClass, TrialActor} from './types';

export class Trial {
  public ended: boolean = false;
  public ending: boolean = false;
  public endingAck: boolean = false;
  public tickId = -1;
  public actors: {name: string; actorClass: CogSettingsActorClass}[] = [];

  constructor(
    public id: string,
    actorsInTrial: TrialActor[],
    cogSettings: CogSettings,
  ) {
    for (const actor of actorsInTrial) {
      if (!(actor.actorClass in cogSettings.actorClasses))
        throw new Error(
          'class [{actor.actor_class}] of actor [{actor.name}] cannot be found.',
        );
      const actorClass = cogSettings.actorClasses[actor.actorClass];
      const newActor = {name: actor.name, actorClass: actorClass};
      this.actors.push(newActor);
    }
  }
}
