/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-params */
/* eslint-disable compat/compat */
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

import {exec} from 'child_process';
import {
  chmodSync,
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import {join} from 'path';
import * as YAML from 'yaml';
import {cogSettingsTemplate, UtilTypes} from '../data/templates';

const shell = (command: string) => {
  console.log(`Executing: ${command}`);
  return new Promise<void>((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`\u001B[31m${error.message}\u001B[0m`);
        resolve();
        return;
      }
      if (stderr) {
        console.log(`\u001B[31m${stderr}\u001B[0m`);
        resolve();
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
};

const sleepPromise = (time: number) => {
  return new Promise<undefined>((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, time);
  });
};

const findObjects = (obj = {}, key: string) => {
  const result: any = [];
  const recursiveSearch = (obj = {}) => {
    if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
      return;
    }
    //@ts-ignore
    if (obj[key] !== undefined) {
      result.push(obj);
    }
    Object.keys(obj).forEach(function (k) {
      //@ts-ignore
      recursiveSearch(obj[k]);
    });
  };
  recursiveSearch(obj);
  return result;
};

export interface PBType {
  typeURL: string;
  typePath: string[];
  file: string;
}

export const generate: () => Promise<void> = async () => {
  const packageJsonExists = existsSync('./package.json');
  if (!packageJsonExists) {
    throw new Error(
      "package.json not found! are you sure you're inside a javascript project?",
    );
  }

  const args = process.argv.slice(2);
  if (args.length === 0) {
    throw new Error(
      'Config not specified, please rerun as `npx cogment-js-sdk-generate <configFile>`',
    );
  }
  const configFile = args[0];

  let cogmentYamlString = '';
  try {
    cogmentYamlString = readFileSync(configFile, 'utf-8');
  } catch (e) {
    throw new Error(`Config file '${configFile}' not found!`);
  }
  const cogmentYaml = YAML.parse(cogmentYamlString);
  const protoFileNames = cogmentYaml.import.proto as string[];

  const protoFiles: {[fileName: string]: string} = {};
  protoFileNames.forEach((fileName) => {
    const fileContent = readFileSync(fileName, 'utf-8');
    protoFiles[fileName] = fileContent;
  });

  const outDirectory = 'src';

  const types: PBType[] = [];

  for (let file of protoFileNames) {
    const fileName = file.split('/').pop()?.split('.')[0] + '_pb';
    if (!fileName) throw new Error('Could not parse file name');
    const js = fileName + '.js';
    const dts = fileName + '.d.ts';

    const outJS = join(outDirectory, js);
    const outTS = join(outDirectory, dts);

    const command = `npx pbjs -t static-module -o ${outJS} -path=. ${file} && npx pbts -o ${outTS} ${outJS}`;
    await shell(command);
    await sleepPromise(1000);
    const moduleName = join(process.cwd(), outJS);
    const module = require(moduleName);
    const classes = findObjects(module, 'create');
    classes.forEach((clazz: any) => {
      types.push({
        typeURL: clazz.getTypeUrl(),
        typePath: clazz.getTypeUrl().split('/')[1].split('.'),
        file: fileName,
      });
    });
  }

  const cogSettings = cogSettingsTemplate(protoFiles, cogmentYaml, types);

  writeFileSync('src/CogTypes.d.ts', UtilTypes);
  writeFileSync('src/CogSettings.ts', cogSettings);
  await shell(
    'npx tsc --noImplicitUseStrict --declaration --declarationMap --outDir src ./src/CogSettings.ts',
  );

  unlinkSync('./src/CogSettings.ts');
  console.log('Done generation!');
};
