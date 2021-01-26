import {Command} from '@oclif/command';
import * as jetpack from 'fs-jetpack';

export default class InitDockerComposeOverride extends Command {
  static description =
    'creates a docker-compose.override.yaml for local development';

  static flags = {};

  static args = [];

  async run() {
    jetpack.copy(
      'docker-compose.override.template.yaml',
      'docker-compose.override.yaml',
      {overwrite: true},
    );
  }
}
