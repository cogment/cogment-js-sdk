## [1.10.2-alpha.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.10.1...v1.10.2-alpha.1) (2021-01-28)


### Bug Fixes

* **docs:** correct npm package name ([d7db03a](https://gitlab.com/ai-r/cogment-js-sdk/commit/d7db03a3b5d9b0e2d74bc96d39fc722d683f1743))
* **npm:** package install failing on chmod of bin ([deda612](https://gitlab.com/ai-r/cogment-js-sdk/commit/deda6124406d27140b6d4a4659b4fcb871d8af04))

## [1.10.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.10.0...v1.10.1) (2021-01-28)


### Bug Fixes

* **npm:** set publishConfig.access to public ([48029d6](https://gitlab.com/ai-r/cogment-js-sdk/commit/48029d621a65d0c5fa28793a3a170ac3caf55b3a))

# [1.10.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.9.1...v1.10.0) (2021-01-28)


### Features

* **#8:** upload package to npm ([a98a396](https://gitlab.com/ai-r/cogment-js-sdk/commit/a98a39642b16ef2ab6058acc024f5d939cff0a5b)), closes [#8](https://gitlab.com/ai-r/cogment-js-sdk/issues/8) [#8](https://gitlab.com/ai-r/cogment-js-sdk/issues/8)
* **sonarqube:** tighter scm integration, ssl/tls for oauth ([d2e9c6b](https://gitlab.com/ai-r/cogment-js-sdk/commit/d2e9c6b0bc819149613ebe1d1bac3e6cabb99c73))

## [1.9.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.9.0...v1.9.1) (2021-01-28)


### Bug Fixes

* **release:** figuring out semantic-release strategy ([c9e9d0f](https://gitlab.com/ai-r/cogment-js-sdk/commit/c9e9d0fa2699eec0ad23968906c4fa1e5494e40d))

# [1.9.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.8.1...v1.9.0) (2021-01-27)


### Features

* **git:** use semantic-release recommended workflow ([54c0743](https://gitlab.com/ai-r/cogment-js-sdk/commit/54c0743d178c2f881f2f64bb74243b15e7ac0e4c))

# [1.9.0-beta.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.8.1...v1.9.0-beta.1) (2021-01-27)


### Features

* **git:** use semantic-release recommended workflow ([54c0743](https://gitlab.com/ai-r/cogment-js-sdk/commit/54c0743d178c2f881f2f64bb74243b15e7ac0e4c))

# [1.9.0-alpha.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.8.1...v1.9.0-alpha.1) (2021-01-27)


### Features

* **git:** use semantic-release recommended workflow ([54c0743](https://gitlab.com/ai-r/cogment-js-sdk/commit/54c0743d178c2f881f2f64bb74243b15e7ac0e4c))

## [1.8.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.8.0...v1.8.1) (2021-01-27)


### Bug Fixes

* **webpack.config.js:** import * as cogment from "@ai-r/cogment-js-sdk" now works ([96aef26](https://gitlab.com/ai-r/cogment-js-sdk/commit/96aef26c1fef58ee5da99b45a86811693c520c34))

# [1.8.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.7.4...v1.8.0) (2021-01-27)


### Bug Fixes

* **ci:** fix binding already bound ports in ci environments ([2468ea5](https://gitlab.com/ai-r/cogment-js-sdk/commit/2468ea5a257a3b370180ab5f449e50e70d3a811b)), closes [#39](https://gitlab.com/ai-r/cogment-js-sdk/issues/39)


### Features

* **cli:** implement a multi command cli executable ([40b4cf4](https://gitlab.com/ai-r/cogment-js-sdk/commit/40b4cf4e8a5f05dd8ab3bde0380707b572484e6d))

## [1.7.4](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.7.3...v1.7.4) (2021-01-26)


### Bug Fixes

* removed 'module' from package.json ([016a6aa](https://gitlab.com/ai-r/cogment-js-sdk/commit/016a6aae3d6c9c63813235dc8c75f78112d374d8))
* Removed 'module' from package.json ([b798119](https://gitlab.com/ai-r/cogment-js-sdk/commit/b798119bd2b1b3eb9de17963a58ff6c74727574b))

## [1.7.3](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.7.2...v1.7.3) (2021-01-22)


### Bug Fixes

* **npm release:** scope npm credentials at project level ([71c5c13](https://gitlab.com/ai-r/cogment-js-sdk/commit/71c5c135a5d5caf1f3e291dae86e8945d44ff9f9))

## [1.7.2](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.7.1...v1.7.2) (2021-01-22)


### Bug Fixes

* **npm release:** gitlab failing to update latest dist-tag ([23b7293](https://gitlab.com/ai-r/cogment-js-sdk/commit/23b7293917cecbbf927ff6d9c9ed6459f41f1293))

## [1.7.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.7.0...v1.7.1) (2021-01-22)


### Bug Fixes

* **npm:** prepare for public package repository release ([432ca1c](https://gitlab.com/ai-r/cogment-js-sdk/commit/432ca1cf4c7757cd4023f98301499a921afd4a60))
* **release:** publish package under the [@ai-r](https://gitlab.com/ai-r) scope for gitlab registry support ([a5b9647](https://gitlab.com/ai-r/cogment-js-sdk/commit/a5b9647d15f687d34e501e30ea98c6d64c2e2815))

# [1.7.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.6.0...v1.7.0) (2021-01-22)


### Features

* **api:** remove internal protobuf from public API boundaries ([6e89414](https://gitlab.com/ai-r/cogment-js-sdk/commit/6e89414def8b2c6a782e31f4c5887b3cdac04ac0)), closes [#24](https://gitlab.com/ai-r/cogment-js-sdk/issues/24)
* **npm:** publish to gitlab's private registry ([6d18330](https://gitlab.com/ai-r/cogment-js-sdk/commit/6d18330745bae81d9d7812c13b696906c17c1356)), closes [#28](https://gitlab.com/ai-r/cogment-js-sdk/issues/28)
* **repository:** renamed repository to cogment-js-sdk (dropping -1.0 suffix) ([a90ffbc](https://gitlab.com/ai-r/cogment-js-sdk/commit/a90ffbcf47ac1f160d4d29f0ef066499f1bd8caa)), closes [#13](https://gitlab.com/ai-r/cogment-js-sdk/issues/13)
* **sonarqube:** integrate sonarqube for code quality reporting ([d081351](https://gitlab.com/ai-r/cogment-js-sdk/commit/d081351e059dd69ab740ebca26aa15cdbea7ad7a))

# [1.6.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.5.1...v1.6.0) (2021-01-13)


### Features

* **api:** refactor API structure ([d3f5ff3](https://gitlab.com/ai-r/cogment-js-sdk/commit/d3f5ff3619eb5715b104c363656191bd2bcd858b)), closes [#19](https://gitlab.com/ai-r/cogment-js-sdk/issues/19)

## [1.5.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.5.0...v1.5.1) (2021-01-13)


### Bug Fixes

* **bin/cli.ts:** fixed zlib error ([d2f3636](https://gitlab.com/ai-r/cogment-js-sdk/commit/d2f36369145eb8366f945542b0eb06a5b609ee0e))

# [1.5.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.4.0...v1.5.0) (2020-12-29)


### Bug Fixes

* **build:** fix esm production builds ([ab38ba7](https://gitlab.com/ai-r/cogment-js-sdk/commit/ab38ba7b6554d92887d33075669122b9905daeba))
* **index:** export all the things! ([94b0ff5](https://gitlab.com/ai-r/cogment-js-sdk/commit/94b0ff57574d36cb7faed9ee1a725f24db03e11e))


### Features

* **builds:** implement esm builds ([fe4ee22](https://gitlab.com/ai-r/cogment-js-sdk/commit/fe4ee22821bdc1af746aad12605937c864c07d15))


### Reverts

* **build:protos:** revert to import_style=commonjs from commonjs_strict ([4c877cb](https://gitlab.com/ai-r/cogment-js-sdk/commit/4c877cb8ae53c1fc6107d0af20d1a0ba30ce675f))
* **gitlab:** need npm install stage in CI build for now ([68e780c](https://gitlab.com/ai-r/cogment-js-sdk/commit/68e780cc020764d92cb2f22a9885a8c63ee0b4d7))

# [1.4.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.3.2...v1.4.0) (2020-12-25)


### Features

* **api:** deserialize internal protobuf messages into user defined types ([400186b](https://gitlab.com/ai-r/cogment-js-sdk/commit/400186b30bbaeabbf4c58372b7fb2def3d225056)), closes [#17](https://gitlab.com/ai-r/cogment-js-sdk/issues/17)
* **logger:** implement DebugLogger using the `debug` package ([78ab264](https://gitlab.com/ai-r/cogment-js-sdk/commit/78ab264e72d83509e3647249d4dbfa700cae5c83))

## [1.3.2](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.3.1...v1.3.2) (2020-12-24)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([ab78a0a](https://gitlab.com/ai-r/cogment-js-sdk/commit/ab78a0aee3a9738bfba783a2ba6a8d2bfaf0213d))

## [1.3.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.3.0...v1.3.1) (2020-12-18)


### Bug Fixes

* **ci:** unable to depend on jobs from the same stage ([7da754a](https://gitlab.com/ai-r/cogment-js-sdk/commit/7da754aaaa9a2afa9ea94fee479f576c8da34e9b))

# [1.3.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.2.1...v1.3.0) (2020-12-18)

### Bug Fixes

- **lint-staged:** arguments were not being passed to jest through npm run test ([a32d360](https://gitlab.com/ai-r/cogment-js-sdk/commit/a32d360cdb99845c91f162d86a2caf89b02381c3))
- **lint-staged:** fix .ts hook pattern to properly exclude .d.ts files ([d7ed999](https://gitlab.com/ai-r/cogment-js-sdk/commit/d7ed999f3ace26e94baa7cb1dc6c56906a00caaa))

### Features

- **websocket:** we have a working websocket streaming eventLoop! ([38228ca](https://gitlab.com/ai-r/cogment-js-sdk/commit/38228caaed9d0b68186f0321b406de8d516b2f7e)), closes [#16](https://gitlab.com/ai-r/cogment-js-sdk/issues/16)
- **websocket:** wip implement websocket transport ([d7344d0](https://gitlab.com/ai-r/cogment-js-sdk/commit/d7344d0098bc3360b7bf0fa33486bd2395d7dba5))

## [1.2.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.2.0...v1.2.1) (2020-12-14)

### Bug Fixes

- **dockerfile:** use more secure base image as per Snyk ([5d6d180](https://gitlab.com/ai-r/cogment-js-sdk/commit/5d6d180cbd35518bded55f595bc00c45bbd808bf))

### Reverts

- **dockerfile:** revert to less secure image for now ([ae389b6](https://gitlab.com/ai-r/cogment-js-sdk/commit/ae389b6006e8752946244a9afde6c7f7cc9b533a))

# [1.2.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.1.0...v1.2.0) (2020-12-14)

### Bug Fixes

- **build:** reduce bundle size by not importing cosmiconfig in the main path ([65fbcdf](https://gitlab.com/ai-r/cogment-js-sdk/commit/65fbcdf434e03f892b50d722a037d54810619316))
- **gitlab-ci:** fix docker-compose logs syntax ([da469dc](https://gitlab.com/ai-r/cogment-js-sdk/commit/da469dc1b4707de5b210850eca4fc2928f48fe4c))

### Features

- **actorsession:** first pass on event loop logic ([4188480](https://gitlab.com/ai-r/cogment-js-sdk/commit/41884806ed109d21af956189eea0bfd71c01a429))
- **config:** implement simple config module ([db8844e](https://gitlab.com/ai-r/cogment-js-sdk/commit/db8844e175879ee1aac38cb6f13dea7d2a44e33b))
- **logger:** add support for log level ([edf7eb4](https://gitlab.com/ai-r/cogment-js-sdk/commit/edf7eb42fbc470587b0551c17fc189fbb92877e8))
- **trialcontroller:** implement getTrialInfo, fix terminateTrial ([b0802b3](https://gitlab.com/ai-r/cogment-js-sdk/commit/b0802b3a2ab275c23f8a5a1556eebdd2315da9ca))

# [1.1.0](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.0.3...v1.1.0) (2020-12-12)

### Bug Fixes

- **tests:** ignore .d.ts files in test commit hook ([299ee93](https://gitlab.com/ai-r/cogment-js-sdk/commit/299ee93bd3c65a9100acc39b090f0e2fe4806103))

### Features

- **implementation:** scaffold out more functions, prepare to connect ([14b573e](https://gitlab.com/ai-r/cogment-js-sdk/commit/14b573e82088ec0fe4b3e090fd97814169822aa0))

## [1.0.3](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.0.2...v1.0.3) (2020-12-11)

### Bug Fixes

- **ci:** need git for semantic-release ([30ed5e3](https://gitlab.com/ai-r/cogment-js-sdk/commit/30ed5e3cb3a4ca59269954eb46b7cc3ccc5e1912))
- **dockerfile:** boo alpine and your weird non-gcc compiler ([256fa34](https://gitlab.com/ai-r/cogment-js-sdk/commit/256fa3412bae87736278a5b84ad6c3a323920524))
- **dockerfile:** node:14-alpine does not include curl ([4377519](https://gitlab.com/ai-r/cogment-js-sdk/commit/43775195ac3c24744d040b6247fa1c9bdaa887a1))
- **package.json:** small package.json fixes ([4b7118b](https://gitlab.com/ai-r/cogment-js-sdk/commit/4b7118b4375ce572fa94d076095f72953952478d))
- **release:** node:14-alpine comes with no git ([7f2a824](https://gitlab.com/ai-r/cogment-js-sdk/commit/7f2a82438c70551355c4a0b318dc6650239d96ec))

### Reverts

- **dockerfile:** use non-alpine inside docker ([054d07d](https://gitlab.com/ai-r/cogment-js-sdk/commit/054d07d1554986a99679bdd9576b6e44d3605d8c))

## [1.0.2](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.0.1...v1.0.2) (2020-12-11)

### Bug Fixes

- **semantic-release:** disable assets for gitlab release for now ([4b3071c](https://gitlab.com/ai-r/cogment-js-sdk/commit/4b3071ce85d7b27e973ebf3298c56c7b838f9930))

## [1.0.1](https://gitlab.com/ai-r/cogment-js-sdk/compare/v1.0.0...v1.0.1) (2020-12-11)

### Bug Fixes

- **ci:** use https for repository url ([d536d11](https://gitlab.com/ai-r/cogment-js-sdk/commit/d536d11355b6787de98583a01fedbd8b26ed3470))

### Reverts

- **ci:** keep using the git protocol for repository ([59c32fb](https://gitlab.com/ai-r/cogment-js-sdk/commit/59c32fbc5b949b0439b8731b9d57896968d1fd2a))

# 1.0.0 (2020-12-11)

### Bug Fixes

- **tooling:** fix repository url ([f90236b](https://gitlab.com/ai-r/cogment-js-sdk/commit/f90236bee379fe51682b95227fa7fdbcb5f0b050))

# 1.0.0 (2020-12-11)

### Bug Fixes

- **tooling:** fix repository url ([f90236b](https://gitlab.com/ai-r/cogment-js-sdk/commit/f90236bee379fe51682b95227fa7fdbcb5f0b050))
