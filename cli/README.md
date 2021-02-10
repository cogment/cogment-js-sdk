# @cogment/cogment-js-cli

Command line tool for the cogment-js-sdk repository

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@cogment/cogment-js-cli.svg)](https://npmjs.org/package/@cogment/cogment-js-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@cogment/cogment-js-cli.svg)](https://npmjs.org/package/@cogment/cogment-js-cli)
[![License](https://img.shields.io/npm/l/@cogment/cogment-js-cli.svg)](https://github.com/cogment/cogment-js-cli/blob/master/package.json)

<!-- toc -->
* [@cogment/cogment-js-cli](#cogmentcogment-js-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @cogment/cogment-js-cli
$ cogjs-cli COMMAND
running command...
$ cogjs-cli (-v|--version|version)
@cogment/cogment-js-cli/0.0.0 linux-x64 node-v14.15.4
$ cogjs-cli --help [COMMAND]
USAGE
  $ cogjs-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`cogjs-cli fetch-protos`](#cogjs-cli-fetch-protos)
* [`cogjs-cli help [COMMAND]`](#cogjs-cli-help-command)
* [`cogjs-cli init:docker-compose-override`](#cogjs-cli-initdocker-compose-override)

## `cogjs-cli fetch-protos`

fetch cogment-api protobuf release

```
USAGE
  $ cogjs-cli fetch-protos

OPTIONS
  -h, --help                   show CLI help
  -r, --releaseUrl=releaseUrl  cogment-api release version, uses cosmiconfig

EXAMPLE
  $ cogjs-cli fetch-protos
```

_See code: [src/commands/fetch-protos.ts](https://github.com/cogment/cogment-js-cli/blob/v0.0.0/src/commands/fetch-protos.ts)_

## `cogjs-cli help [COMMAND]`

display help for cogjs-cli

```
USAGE
  $ cogjs-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `cogjs-cli init:docker-compose-override`

creates a docker-compose.override.yaml for local development

```
USAGE
  $ cogjs-cli init:docker-compose-override
```

_See code: [src/commands/init/docker-compose-override.ts](https://github.com/cogment/cogment-js-cli/blob/v0.0.0/src/commands/init/docker-compose-override.ts)_
<!-- commandsstop -->
