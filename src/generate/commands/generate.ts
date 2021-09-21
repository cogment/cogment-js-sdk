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

import * as YAML from 'yaml';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {cogSettingsTemplate} from '../data/templates';
import {exec} from 'child_process';

const shell = (command: string) => {
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

const isInstalled = (testPackage: string) => {
  try {
    require.resolve(testPackage);
    return true;
  } catch {
    return false;
  }
};

export const generate: () => Promise<void> = async () => {
  const packageJsonExists = existsSync('./package.json');
  if (!packageJsonExists) {
    throw new Error(
      "package.json not found! are you sure you're inside a javascript project?",
    );
  }

  if (!existsSync('./node_modules')) {
    await shell('npm i');
  }

  if (isInstalled('grpc-tools')) {
    try {
      await shell('npm i grpc-tools');
    } catch {
      throw new Error(
        'Could not install auxilliary generation tools, try running `npm i --save-optional`',
      );
    }
  }
  if (isInstalled('protoc-gen-ts')) {
    try {
      await shell('npm i protoc-gen-ts');
    } catch {
      throw new Error(
        'Could not install auxilliary generation tools, try running `npm i --save-optional`',
      );
    }
  }

  const cogmentYamlString = readFileSync('./cogment.yaml', 'utf-8');
  const cogmentYaml = YAML.parse(cogmentYamlString);
  const protoFileNames = cogmentYaml.import.proto as string[];

  const protoFiles: {[fileName: string]: string} = {};
  protoFileNames.forEach((fileName) => {
    const fileContent = readFileSync(fileName, 'utf-8');
    protoFiles[fileName] = fileContent;
  });

  const cogSettings = cogSettingsTemplate(protoFiles, cogmentYaml);

  await shell(
    `node_modules/.bin/grpc_tools_node_protoc ${protoFileNames.join(
      ' ',
    )} --js_out=import_style=commonjs,binary:src --plugin=protoc-gen-ts=node_modules/.bin/protoc-gen-ts --ts_out=service=grpc-web:src`,
  );
  writeFileSync('src/CogSettings.ts', cogSettings);
  await shell(
    'npx tsc --noImplicitUseStrict --declaration --declarationMap --outDir src ./src/CogSettings.ts',
  );
  await shell('rm -f ./src/CogSettings.ts');
  console.log('Done generation!');
};
