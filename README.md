# cogment-js-sdk

[![cogment](https://img.shields.io/badge/cogment-brightgreen.svg)][repo]
[![Gitlab pipeline status](https://gitlab.com/ai-r/cogment-js-sdk/badges/main/pipeline.svg?private_token=-PxNqY8axtUuGoys4tGj)][repo]
[![codecov](https://codecov.io/gl/ai-r/cogment-js-sdk/branch/main/graph/badge.svg?token=aTpPl9c87b)][codecov]
[![Downloads / Month](https://img.shields.io/npm/dm/cogment)][npm-cogment]
[![License](https://img.shields.io/npm/l/cogment)][license]
[![npm](https://img.shields.io/npm/v/cogment)][npm-cogment]
[![npm collaborators](https://img.shields.io/npm/collaborators/cogment)][npm-cogment]
[![Dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/cogment)][npm-cogment]
[![Dependent repos (via libraries.io)](https://img.shields.io/librariesio/dependent-repos/npm/cogment)][npm-cogment]
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![OSS Lifecycle](https://img.shields.io/osslifecycle/cogment/cogment-js-sdk)
![GitHub forks](https://img.shields.io/github/forks/cogment/cogment-js-sdk?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/cogment/cogment-js-sdk?style=social)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- prettier-ignore-start -->
[TOC]: #

## Table of Contents
- [cogment-js-sdk](#cogment-js-sdk)
  - [Links](#links)
  - [Usage](#usage)
  - [Hacking](#hacking)
    - [Local Hacking](#local-hacking)
      - [node.js](#nodejs)
      - [Setup](#setup)
    - [Docker Hacking](#docker-hacking)
  - [Tests](#tests)
    - [Local Testing](#local-testing)
    - [Docker Testing](#docker-testing)

<!-- prettier-ignore-end -->

## Links

- [cogment.ai]
- [Repository][repo]
- [API Documentation][api-docs]
- [License][license]
- [Changelog][changelog]
- [Test Report][tests]
- [Coverage Report][coverage]
- [Webpack Bundle Report][webpack]
- [Design Proposal][proposal]

## Usage

To install the package:

```shell script
npm install cogment
```

## Hacking

Clone the repository:

```shell script
git clone https://github.com/cogment/cogment-js-sdk
```

### Local Hacking

#### node.js

For local hacking, a working node.js distribution is required. This
repository supports [nvm] and [nodenv] through the [.nvmrc](.nvmrc) and
[.node-version](.node-version) files.

A simple node.js environment install using [nvm] (note, _NO_ sudo is
required!):

```shell script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.nvm/nvm.sh
cd /path/to/cogment-js-sdk
nvm install
```

#### Setup

Once a working node.js distribution is available:

1. Install dependencies:
   ```shell script
   npm install
   ```
2. Download and compile [cogment-api] protobuf files:
   ```shell script
   npm run build:protos
   ```

### Docker Hacking

Local hacking is also supported through docker, removing the necessity
for a local node.js distribution. [docker-compose] is used to simplify
the configuration of creating containers - install before proceeding.

```shell script
docker-compose build cogment-js-sdk
```

## Tests

Before running any tests, start the local [embedded end-to-end cogment
application][cogment-app] docker environment:

```shell script
bin/up.bash
```

This script may be rerun again if any changes are made to the [embedded
end-to-end cogment application][cogment-app].

If you wish to stop the [embedded end-to-end cogment
application][cogment-app], use the following script:

```shell script
bin/down.bash
```

### Local Testing

Note: By default the test environment is configured to run within a
docker container. [cogment-js-sdk][repo] uses [cosmiconfig] for
configuration - update `cogment.connection.http` in [package.json] to
`http://localhost:8080` (or the host of the docker daemon if it is not
running on `localhost:8080`).

To run the test suite once:

```shell script
npm run test`
```

To watch for changes and rerun tests automatically in your console:

```shell script
npm run test:watch
```

To launch the [majestic test ui][majestic] to run / watch / visualize
tests:

```shell script
npm run test:ui
```

### Docker Testing

To run the test suite using a docker container (necessitates the need
for a local node.js distribution), the `cogment-js-sdk`
[docker-compose][docker-compose] service can be used:

```shell script
docker-compose run cogment-js-sdk npm run test
```

[api-docs]: https://ai-r.gitlab.io/cogment-js-sdk 'api-docs'
[changelog]: CHANGELOG.md 'changelog'
[codecov]: https://codecov.io/gl/ai-r/cogment-js-sdk 'codecov'
[cogment-app]: __tests__/end-to-end/cogment-app 'cogment-app'
[cogment-api]: https://github.com/cogment/cogment-api 'cogment-api'
[cogment.ai]: https://cogment.ai 'cogment.ai'
[cosmiconfig]: https://www.npmjs.com/package/cosmiconfig 'cosmiconfig'
[coverage]: https://ai-r.gitlab.io/cogment-js-sdk/coverage/lcov-report 'coverage report'
[docker-compose]: https://docs.docker.com/compose/ 'docker-compose'
[license]: LICENSE.md 'license'
[majestic]: https://github.com/Raathigesh/majestic 'majestic'
[nodenv]: https://github.com/nodenv/nodenv 'nodenv'
[npm-cogment]: https://www.npmjs.com/package/cogment 'npm-cogment'
[nvm]: https://github.com/nvm-sh/nvm 'nvm'
[package.json]: package.json 'package.json'
[proposal]: https://docs.google.com/document/d/1K6qCuY-wGlNJzeJuEQEy6bALwJBFNDpJ6HB4LzU-Bq8/edit
[repo]: https://gitlab.com/ai-r/cogment-js-sdk/ 'Repository'
[tests]: https://ai-r.gitlab.io/cogment-js-sdk/allure
[webpack]: https://ai-r.gitlab.io/cogment-js-sdk/webpack/cjs
