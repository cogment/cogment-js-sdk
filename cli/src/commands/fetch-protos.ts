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

import {Command, flags} from '@oclif/command';
import axios from 'axios';
import {cosmiconfig} from 'cosmiconfig';
import {CosmiconfigResult} from 'cosmiconfig/dist/types';
import decompress from 'decompress';
import {ReadStream} from 'fs';
import * as jetpack from 'fs-jetpack';
import path from 'path';

const moduleName = 'cogment-api';

interface CogmentApiConfig {
  releaseUrl: string;
}

export default class FetchProtos extends Command {
  static description = 'fetch cogment-api protobuf release';

  static examples = [`$ cogjs-cli fetch-protos`];

  static flags = {
    help: flags.help({char: 'h'}),
    releaseUrl: flags.string({
      char: 'r',
      description: 'cogment-api release version, uses cosmiconfig',
    }),
  };

  static args = [];

  async run(): Promise<void> {
    const {flags} = this.parse(FetchProtos);

    const tarballTemporaryDirectory = jetpack.tmpDir({prefix: 'cogment-api'});
    const tarballName = 'cogment-api.tar.gz';
    const tarballPath = tarballTemporaryDirectory.path(tarballName);

    const result: CosmiconfigResult = await cosmiconfig(moduleName).search();

    if (!result || !result.config) {
      this.error('No configuration provided', {exit: 1});
    }
    const config: CogmentApiConfig = result.config as CogmentApiConfig;
    const url = flags.releaseUrl ?? config.releaseUrl;

    this.log(`Fetching cogment-api from ${url}`);

    try {
      const response = await axios.request<ReadStream>({
        url,
        responseType: 'stream',
      });
      // eslint-disable-next-line compat/compat
      await Promise.all([
        // eslint-disable-next-line compat/compat
        new Promise((resolve, reject) => {
          response.data.on('close', resolve);
          response.data.on('error', reject);
          response.data.pipe(
            tarballTemporaryDirectory.createWriteStream(tarballName),
          );
        }),
        jetpack.dirAsync('cogment/api'),
      ]);
    } catch (error) {
      this.error(
        `Failed to fetch cogment-api: ${(error as Error).stack ?? ''}`,
        {
          exit: 1,
        },
      );
      throw error;
    }

    this.log('Download successful, decompressing tarball');
    try {
      await decompress(tarballPath, tarballTemporaryDirectory.cwd());
    } catch (error) {
      this.error(
        `Failed to decompress cogmant-api: ${(error as Error).stack ?? ''}`,
        {exit: 1},
      );
    }

    this.log(
      'Decompression successful, copying .proto files to cogment/api/*.proto',
    );

    tarballTemporaryDirectory
      .find({
        matching: '*.proto',
      })
      .forEach((file) =>
        jetpack.move(
          tarballTemporaryDirectory.path(file),
          `cogment/api/${path.basename(file)}`,
          {
            overwrite: true,
          },
        ),
      );
  }
}
