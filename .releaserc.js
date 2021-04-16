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

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    {
      name: 'alpha',
      prerelease: true,
    },
    {
      name: 'beta',
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
        tarballDir: '.',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'cogment-cogment-js-sdk-*.*.*.tgz',
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
    [
      '@semantic-release/exec',
      {
        publishCmd: 'npm run build:docs:html',
      },
    ],
    [
      '@qiwi/semantic-release-gh-pages-plugin',
      {
        msg: 'docs: updated <%= nextRelease.gitTag %>',
        src: 'public',
        dst: '.',
        branch: 'gh-pages',
        repositoryUrl: 'https://github.com/cogment/cogment-js-sdk',
        pullTagsBranch: 'main',
      },
    ],
    '@semantic-release/git',
  ],
};
