const {https, http} = require('follow-redirects');
const fs = require('fs');

const config = require('../config.json');

const url = new URL(config.cogmentApi); // 'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.2-97d11b01.tar.gz'
const agent = url.protocol === 'https:' ? https : http;

const file = fs.createWriteStream('bin/cogment', {
  mode: 0o755,
});

const osMap = {
  darwin: 'macOS',
  linux: 'linux',
  win32: 'windows',
};

const os = osMap[process.platform.toString()];

agent.get(config.cogmentCli.replace('${OS}', os), function (response) {
  response.pipe(file);
});
