const path = require('path');
const glob = require('glob');
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

if (!argv.outDirectory || !argv.protoFiles) {
  throw new Error('you must set an out Directory and a list of Proto files');
}

const outDirectory = argv.outDirectory;
const protoFiles = Array.isArray(argv.protoFiles) ? argv.protoFiles : [argv.protoFiles];

if (!fs.existsSync(outDirectory)) {
  fs.mkdirSync(outDirectory);
}

fs.chmodSync('./node_modules/protobufjs/cli/bin/pbjs', 0o755);
fs.chmodSync('./node_modules/protobufjs/cli/bin/pbts', 0o755);

protoFiles.forEach((file) => {
  glob(file, {}, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      const fileName = file.split('/').pop().split('.')[0] + '_pb_2';
      const js = fileName + '.js';
      const dts = fileName + '.d.ts';
      const json = fileName + '.json.js';

      const outJS = path.join(outDirectory, js);
      const outTS = path.join(outDirectory, dts);

      const command = `./node_modules/protobufjs/cli/bin/pbjs -t static-module -o ${outJS} -path=. ${file} && ./node_modules/protobufjs/cli/bin/pbts -o ${outTS} ${outJS}`;
      console.log(command);
      require('child_process').execSync(command);
    });
  });

  const command = `npx grpc_tools_node_protoc -I . ${file} --js_out=import_style=commonjs,binary:./src --ts_out=service=grpc-web:./src`;
  console.log(command);
  require('child_process').execSync(command);
});
