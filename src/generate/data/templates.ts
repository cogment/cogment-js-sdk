/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 *  Copyright 2021 AI Redefined Inc. <dev+cogment@ai-r.com>
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
import { pascalCase } from 'pascal-case';

const fileIn = (protoFiles: { [filename: string]: string }, token: string) => {
  for (const filename in protoFiles) {
    if (protoFiles[filename].includes(token)) {
      return filename.split('.')[0];
    }
  }
  throw new Error('no proto file contains token ' + token);
};

const procToken = (protoFiles: { [filename: string]: string }, token: string) => {
  const realToken = token.split('.')[1];
  const file = fileIn(protoFiles, realToken);
  return file + '_pb.' + token;
};

export const cogSettingsTemplate = (
  protoFiles: { [filename: string]: string },
  cogSettings: any,
) => `
import {Message} from 'google-protobuf';
import { MessageBase } from '@cogment/cogment-js-sdk';
import { MessageClass } from '@cogment/cogment-js-sdk';

${cogSettings.import.javascript
    ? (cogSettings.import.javascript as string[])
      .map((element: string) => `import * as ${element} from './${element}'`)
      .join('\n')
    : ''
  }
${cogSettings.import.proto
    ? (cogSettings.import.proto as string[])
      .map(
        (element: string) =>
          `import * as ${element.split('.')[0] + '_pb'} from './${element.split('.')[0] + '_pb'
          }'`,
      )
      .join('\n')
    : ''
  }

export interface ActorClass {
  name: string;
  config?: MessageClass;
  actionSpace: MessageClass;
  observationSpace: MessageClass;
  observationDelta?: MessageClass;
  observationDeltaApply?: (x: MessageBase) => MessageBase;
}

${(
    cogSettings.actor_classes as {
      name: string;
      config_type: string;
      action: { space: string };
      observation: { space: string; delta: string };
    }[]
  )
    .map(
      (actorClass) => `
export class ${pascalCase(actorClass.name)}ActorClass implements ActorClass {
  name = '${actorClass.name}';
  ${actorClass.config_type
          ? `config = ${procToken(protoFiles, actorClass.config_type)}`
          : ``
        }
  actionSpace = ${procToken(protoFiles, actorClass.action.space)};
  observationSpace = ${procToken(protoFiles, actorClass.observation.space)};
  observationDelta = ${actorClass.observation.delta
          ? procToken(protoFiles, actorClass.observation.delta)
          : procToken(protoFiles, actorClass.observation.space)
        };
  observationDeltaApply(observationDelta: MessageBase) {
    return observationDelta;
  }
}
`,
    )
    .join('\n')}

export const cogSettings = {
  actorClasses: {
      ${(cogSettings.actor_classes as { name: string }[])
    .map(
      (actorClass) =>
        `${actorClass.name}: new ${pascalCase(
          actorClass.name,
        )}ActorClass()`,
    )
    .join(',\n')}
  },
  trial: {
    ${cogSettings.trial.config_type
    ? `config: ${procToken(protoFiles, cogSettings.trial.config_type)}`
    : ``
  }
  },
  environment: {
    ${cogSettings.environment.config_type
    ? `config: ${procToken(
      protoFiles,
      cogSettings.environment.config_type,
    )},`
    : ``
  }
    class: {
      id: 'env',
      ${cogSettings.environment.config_type
    ? `config: ${procToken(
      protoFiles,
      cogSettings.environment.config_type,
    )}`
    : ``
  }
    }
  },
};

export type CogSettings = typeof cogSettings;
`;
