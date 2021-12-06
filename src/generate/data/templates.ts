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
import {pascalCase} from 'pascal-case';
import {PBType} from '../commands/generate';

const fileIn = (protoFiles: {[filename: string]: string}, token: string) => {
  for (const filename in protoFiles) {
    if (protoFiles[filename].includes(token)) {
      return filename.split('.')[0];
    }
  }
  throw new Error('no proto file contains token ' + token);
};

const procToken = (protoFiles: {[filename: string]: string}, token: string) => {
  const realToken = token.split('.')[1];
  const file = fileIn(protoFiles, realToken);
  return file + '_pb.' + token;
};

export const cogSettingsTemplate = (
  protoFiles: {[filename: string]: string},
  cogSettings: any,
  pbTypes: PBType[],
) => `
import { MessageBase } from './CogTypes';
import { MessageClass } from './CogTypes';

${
  cogSettings.import.javascript
    ? (cogSettings.import.javascript as string[])
        .map((element: string) => `import * as ${element} from './${element}'`)
        .join('\n')
    : ''
}
${
  cogSettings.import.proto
    ? (cogSettings.import.proto as string[])
        .map(
          (element: string) =>
            `import * as ${element.split('.')[0] + '_pb'} from './${
              element.split('.')[0] + '_pb'
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
}

${(
  cogSettings.actor_classes as {
    name: string;
    config_type: string;
    action: {space: string};
    observation: {space: string; delta: string};
  }[]
)
  .map((actorClass) => {
    if (actorClass.observation.delta)
      throw new Error(
        `${actorClass.name} has an observation delta in the configuration file, this is no longer supported in Cogment 2.0, please remove this property`,
      );

    return `
export class ${pascalCase(actorClass.name)}ActorClass implements ActorClass {
  name = '${actorClass.name}';
  ${
    actorClass.config_type
      ? `config = ${procToken(protoFiles, actorClass.config_type)}`
      : ``
  }
  actionSpace = ${procToken(protoFiles, actorClass.action.space)};
  observationSpace = ${procToken(protoFiles, actorClass.observation.space)};
}
`;
  })
  .join('\n')}

export const cogSettings = {
  messageUrlMap: {
    ${pbTypes
      .map(
        (pbType) =>
          `["${pbType.typeURL}"]: ${pbType.file}.${pbType.typePath.join('.')}`,
      )
      .join(',\n  ')}
  },
  actorClasses: {
      ${(cogSettings.actor_classes as {name: string}[])
        .map(
          (actorClass) =>
            `${actorClass.name}: new ${pascalCase(
              actorClass.name,
            )}ActorClass()`,
        )
        .join(',\n')}
  },
  trial: {
    ${
      cogSettings.trial.config_type
        ? `config: ${procToken(protoFiles, cogSettings.trial.config_type)}`
        : ``
    }
  },
  environment: {
    ${
      cogSettings.environment.config_type
        ? `config: ${procToken(
            protoFiles,
            cogSettings.environment.config_type,
          )},`
        : ``
    }
    class: {
      id: 'env',
      ${
        cogSettings.environment.config_type
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

export const UtilTypes = `




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
 *  WIanyHOUany WARRANanyIES OR CONDIanyIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { Constructor, IConversionOptions, Properties, Reader, Writer } from "protobufjs";

export class Message {

    /**
     * Constructs a new message instance.
     * @param [properties] Properties to set
     */
    constructor(properties?: Properties<any>)

    /**
     * Creates a new message of this type using the specified properties.
     * @param [properties] Properties to set
     * @returns Message instance
     */
    public static create(this: Constructor<Message>, properties?: { [k: string]: any }): Message

    /**
     * Encodes a message of this type.
     * @param message Message to encode
     * @param [writer] Writer to use
     * @returns Writer
     */
    public static encode(this: Constructor<Message>, message: (any | { [k: string]: any }), writer?: Writer): Writer;

    /**
     * Encodes a message of this type preceeded by its length as a varint.
     * @param message Message to encode
     * @param [writer] Writer to use
     * @returns Writer
     */
    public static encodeDelimited(this: Constructor<Message>, message: (any | { [k: string]: any }), writer?: Writer): Writer;

    /**
     * Decodes a message of this type.
     * @param reader Reader or buffer to decode
     * @returns Decoded message
     */
    public static decode(this: Constructor<Message>, reader: (Reader | Uint8Array)): Message;

    /**
     * Decodes a message of this type preceeded by its length as a varint.
     * @param reader Reader or buffer to decode
     * @returns Decoded message
     */
    public static decodeDelimited(this: Constructor<Message>, reader: (Reader | Uint8Array)): Message;

    /**
     * Verifies a message of this type.
     * @param message Plain object to verify
     * @returns 'null' if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null);

    /**
     * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Message instance
     */
    public static fromObject(this: Constructor<Message>, object: { [k: string]: any }): Message;

    /**
     * Creates a plain object from a message of this type. Also converts values to other types if specified.
     * @param message Message instance
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(this: Constructor<Message>, message: Message, options?: IConversionOptions): { [k: string]: any };

    /**
     * Converts this message to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export type MessageBase = Message;

export type MessageClass = typeof Message

`;
