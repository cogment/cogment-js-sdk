# Cogment Javascript SDK end-to-end tests

This is a suite of end-to-end tests relying on an actor service and an environment service implemented using the python SDK.

## Overview

This directory is organised as follow:

- The `cogment.yaml` and `data.proto` files define the actor classes and their datastructures,
- In `./py-services` are defined two very simple services, in `env.py`, an environment service exposing an environment implementation, in `echo.py` an actor service exposing an _echo_ actor implementation,
- In `src/*.test.js` are define suites of javascript tests implemented using [Jest](https://jestjs.io),
- The `params.yaml` is used by the Cogment orchestrator as default [trial parameters](https://cogment.ai/docs/reference/parameters#parameter-file), 
- Finally, `test_launch.yaml` defines how the Cogment test application is launched using [`cogment launch`](https://cogment.ai/docs/reference/cli/launch).

## Usage

To install and build dependencies run:

`npm install && npm run build` 

To run the tests:

`npm run test`
