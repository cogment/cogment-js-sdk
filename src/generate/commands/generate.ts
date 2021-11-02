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

import { exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from "path";
import * as YAML from 'yaml';
import { cogSettingsTemplate } from '../data/templates';

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

  if (!isInstalled('protobufjs')) {
    try {
      await shell('npm i protobufjs');
    } catch {
      throw new Error(
        'Could not install auxilliary generation tools, try running `npm i --save-optional`',
      );
    }
  }

  const cogmentYamlString = readFileSync('./cogment.yaml', 'utf-8');
  const cogmentYaml = YAML.parse(cogmentYamlString);
  const protoFileNames = cogmentYaml.import.proto as string[];

  const protoFiles: { [fileName: string]: string } = {};
  protoFileNames.forEach((fileName) => {
    const fileContent = readFileSync(fileName, 'utf-8');
    protoFiles[fileName] = fileContent;
  });

  const cogSettings = cogSettingsTemplate(protoFiles, cogmentYaml);
  const outDirectory = "src"

  protoFileNames.forEach(file => {

    const fileName = file.split("/").pop()?.split(".")[0] + "_pb"
    if (!fileName) throw new Error("Could not parse file name");
    const js = fileName + ".js"
    const dts = fileName + ".d.ts"

    const outJS = path.join(outDirectory, js)
    const outTS = path.join(outDirectory, dts)

    const command = `npx pbjs -t static-module -o ${outJS} -path=. ${file} && npx pbts -o ${outTS} ${outJS}`
    shell(command)
  })

  writeFileSync('src/CogSettings.ts', cogSettings);
  await shell(
    'npx tsc --noImplicitUseStrict --declaration --declarationMap --outDir src ./src/CogSettings.ts',
  );
  await shell('rm -f ./src/CogSettings.ts');
  console.log('Done generation!');
};
