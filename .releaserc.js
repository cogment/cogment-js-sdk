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

const COMMON_DIST_FILES = ['index.d.ts', 'index.d.ts.map'];

const gatherDistFiles = (distFiles) => [...distFiles, ...COMMON_DIST_FILES];

const generateDistGlob = (distFiles) =>
  `dist/{${gatherDistFiles(distFiles).join(',')}}`;

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    {
      name: 'alpha',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        prepare: true,
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: generateDistGlob([
              'cogment.js',
              'cogment.js.map',
              'cogment.js.LICENSE.txt',
            ]),
            label: 'CommonJS2 bundle',
          },
          {
            path: generateDistGlob([
              'cogment.esm.js',
              'cogment.esm.js.map',
              'cogment.esm.js.LICENSE.txt',
            ]),
            label: 'ESM bundle',
          },
          {
            path: generateDistGlob([
              'cogment.umd.js',
              'cogment.umd.js.map',
              'cogment.umd.js.LICENSE.txt',
            ]),
            label: 'UMD bundle',
          },
        ],
      },
    ],
    [
      '@semantic-release/exec',
      {
        publishCmd: 'bin/publish.sh',
      },
    ],
    '@semantic-release/git',
  ],
};
