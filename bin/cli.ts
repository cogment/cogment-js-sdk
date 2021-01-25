#!/usr/bin/env node_modules/.bin/ts-node
/*
 *  Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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

import axios from 'axios';
import {cosmiconfig} from 'cosmiconfig';
import decompress from 'decompress';
import {ReadStream} from 'fs';
import jetpack from 'fs-jetpack';
import path from 'path';
import process from 'process';

const moduleName = 'cogment-api';
const tarballTmpDir = jetpack.tmpDir({prefix: 'cogment-api'});
const tarballName = 'cogment-api.tar.gz';
const tarballPath = tarballTmpDir.path(tarballName);

const explorer = cosmiconfig(moduleName);

interface CogmentApiConfig {
  cogment_api_version: string;
}

async function fetchProtos({cogmentApiVersion}: {cogmentApiVersion: string}) {
  const response = await axios.request<ReadStream>({
    url: `https://github.com/cogment/cogment-api/archive/v${cogmentApiVersion}.tar.gz`,
    responseType: 'stream',
  })
    
  // eslint-disable-next-line compat/compat
  await Promise.all([
    // eslint-disable-next-line compat/compat
    new Promise((resolve, reject) => {
      response.data.on('close', resolve);
      response.data.on('error', reject);
      response.data.pipe(tarballTmpDir.createWriteStream(tarballName));
    }),
    jetpack.dirAsync('cogment/api'),
  ]),

  await decompress(tarballPath, tarballTmpDir.cwd())
   
  const files = tarballTmpDir.find(`cogment-api-${cogmentApiVersion}`, {
    matching: '*.proto',
  });

  files.forEach((file) =>
    jetpack.move(
      tarballTmpDir.path(file),
      `cogment/api/${path.basename(file)}`,
      {
        overwrite: true,
      },
    ),
  );
}

explorer
  .search()
  .then((result) => {
    if (!result || !result.config) {
      console.trace('No configuration provided');
      process.exit(1);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const config: CogmentApiConfig = result.config;
    const cogmentApiVersion: string = config.cogment_api_version;
    return fetchProtos({cogmentApiVersion});
  })
  .catch((error: Error) => {
    console.error(error.stack);
  });
