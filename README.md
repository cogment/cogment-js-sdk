# cogment-js-sdk

[![cogment](https://img.shields.io/badge/cogment-brightgreen.svg)][repo]
[![npm](https://img.shields.io/npm/dw/@cogment/cogment-js-sdk)][npm-cogment]
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@cogment/cogment-js-sdk)][npm-cogment]
[![License](https://img.shields.io/npm/l/@cogment/cogment-js-sdk)][license]
[![npm](https://img.shields.io/npm/v/@cogment/cogment-js-sdk)][npm-cogment]
[![npm collaborators](https://img.shields.io/npm/collaborators/@cogment/cogment-js-sdk)][npm-cogment]
[![Dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/@cogment/cogment-js-sdk)][npm-cogment]
[![Dependent repos (via libraries.io)](https://img.shields.io/librariesio/dependent-repos/npm/@cogment/cogment-js-sdk)][npm-cogment]
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![OSS Lifecycle](https://img.shields.io/osslifecycle/cogment/cogment-js-sdk)
![GitHub forks](https://img.shields.io/github/forks/cogment/cogment-js-sdk?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/cogment/cogment-js-sdk?style=social)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)][code-of-conduct]

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
- [Code of Conduct][code-of-conduct]
- [License][license]
- [Changelog][changelog]
- [Open Core Development][opencore-development]
- [Coding guidelines][codeguidelines]
- [Sentimental Versioning][sentimental-versioning]
- [Test Report][tests]
- [Coverage Report][coverage]
- [Webpack Bundle Report][webpack]
- [cogjs-cli][cogjs-cli]
- [Semantic Versioning][semver.org]

## Usage

To install the package:

```shell script
npm install @cogment/cogment-js-sdk
```

## Hacking

Clone the repository:

```shell script
git clone https://github.com/cogment/cogment-js-sdk.git
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

Once a working node.js distribution is available, there is a single npm
script, `init`, that will initialize the repository for local
development (including running `npm install`):

```shell script
npm run init
```

### Docker Hacking

Local hacking is also supported through docker, removing the necessity
for a local node.js distribution. [docker-compose] is used to simplify
the configuration of creating containers - install before proceeding.

1. Build the docker container:
   ```shell script
   docker-compose build cogment-js-sdk
   ```
2. Initialize the repository:
   ```shell script
   docker-compose run cogment-js-sdk npm run init
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
configuration - currently stored under the key `cogment.connection.http`
in [package.json].

The default configuration is to contact the grpc-web proxy at
`grpcwebproxy:8080`. Either:

- Change this value to `http://localhost:8080` (or the host of the
  docker daemon if it is not running on `localhost:8080`)
- Create an `/etc/hosts` entry that points to the appropriate docker
  daemon

To run the test suite once:

```shell script
npm run test
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
[code-of-conduct]: CODE_OF_CONDUCT.md
[codeguidelines]: docs/codeguidelines.md
[cogjs-cli]: ./cli
[cogment-app]: __tests__/end-to-end/cogment-app 'cogment-app'
[cogment.ai]: https://cogment.ai 'cogment.ai'
[cosmiconfig]: https://www.npmjs.com/package/cosmiconfig 'cosmiconfig'
[coverage]: https://ai-r.gitlab.io/cogment-js-sdk/coverage/lcov-report 'coverage report'
[docker-compose]: https://docs.docker.com/compose/ 'docker-compose'
[license]: LICENSE.md 'license'
[majestic]: https://github.com/Raathigesh/majestic 'majestic'
[nodenv]: https://github.com/nodenv/nodenv 'nodenv'
[npm-cogment]: https://www.npmjs.com/package/cogment 'npm-cogment'
[nvm]: https://github.com/nvm-sh/nvm 'nvm'
[opencore-development]: docs/opencore-development.md
[package.json]: package.json 'package.json'
[repo]: https://gitlab.com/ai-r/cogment-js-sdk/ 'Repository'
[sentimental-versioning]: http://sentimentalversioning.org/
[tests]: https://ai-r.gitlab.io/cogment-js-sdk/allure
[webpack]: https://ai-r.gitlab.io/cogment-js-sdk/webpack/cjs
[semver.org]: https://semver.org
