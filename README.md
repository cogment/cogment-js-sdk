# cogment-js-sdk

[![cogment](https://img.shields.io/badge/cogment-brightgreen.svg)][repo]
[![Gitlab pipeline status](https://gitlab.com/ai-r/cogment-js-sdk-1.0/badges/main/pipeline.svg?private_token=-PxNqY8axtUuGoys4tGj)][repo]
[![codecov](https://codecov.io/gl/ai-r/cogment-js-sdk-1.0/branch/main/graph/badge.svg?token=aTpPl9c87b)][codecov]
[![Downloads / Month](https://img.shields.io/npm/dm/cogment)][npm]
[![License](https://img.shields.io/npm/l/cogment)][license]
[![npm](https://img.shields.io/npm/v/cogment)][npm]
[![npm collaborators](https://img.shields.io/npm/collaborators/cogment)][npm]
[![Dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/cogment)][npm]
[![Dependent repos (via libraries.io)](https://img.shields.io/librariesio/dependent-repos/npm/cogment)][npm]
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![OSS Lifecycle](https://img.shields.io/osslifecycle/cogment/cogment-js-sdk)
![GitHub forks](https://img.shields.io/github/forks/cogment/cogment-js-sdk?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/cogment/cogment-js-sdk?style=social)

- [cogment][cogment]
- [Repository][repo]
- [Design Proposal][proposal1]
- [Coverage Report][coverage]
- [API Documentation][api-docs]
- [License][license]
- [Changelog][changelog]

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

### Local

#### node.js

For local hacking, a working node.js distribution is required. This repository supports [nvm][nvm] and [nodenv][nodenv] through the [.nvmrc](.nvmrc) and [.node-version](.node-version) files.

A simple node.js environment install using [nvm][nvm] (note, _NO_ sudo is required!):

```shell script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.nvm/nvm.sh
cd /path/to/cogment-js-sdk
nvm install
```

#### Setup

Once a working node.js distribution is available, install dependencies:

```shell script
npm install
```

### Docker

Local development is also supported through docker, removing the necessity for a local node.js distribution. [docker-compose][docker-compose] is used to simplify the configuration of creating containers - install before proceeding.

```shell script
docker-compose build cogment-js-sdk
```

## Running tests

To run the test suite once:

`npm run test`

To watch for changes and rerun tests automatically in your console:

`npm run test:watch`

To launch the [majestic test ui][majestic] to run / watch / visualize tests:

`npm run test:ui`

[cogment]: https://cogment.ai
[repo]: https://gitlab.com/ai-r/cogment-js-sdk-1.0/
[coverage]: https://ai-r.gitlab.io/cogment-js-sdk-1.0/coverage/report
[api-docs]: https://ai-r.gitlab.io/cogment-js-sdk-1.0/api
[proposal1]: https://docs.google.com/document/d/1K6qCuY-wGlNJzeJuEQEy6bALwJBFNDpJ6HB4LzU-Bq8/edit
[changelog]: CHANGELOG.md
[license]: LICENSE
[npm]: https://www.npmjs.com/package/cogment
[codecov]: https://codecov.io/gl/ai-r/cogment-js-sdk-1.0
[majestic]: https://github.com/Raathigesh/majestic
[nvm]: https://github.com/nvm-sh/nvm
[nodenv]: https://github.com/nodenv/nodenv
[docker-compose]: https://docs.docker.com/compose/
