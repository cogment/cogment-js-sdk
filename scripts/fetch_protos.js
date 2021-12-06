const http = require('http');
const https = require('https');
const fs = require('fs');
const tar = require('tar');

const config = require('../config.json');

if (!fs.existsSync('cogment/api')) {
  fs.mkdirSync('cogment/api', {recursive: true});
}

process.chdir('cogment/api');

const url = new URL(config.cogmentApi); // 'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.2-97d11b01.tar.gz'
const agent = url.protocol === 'https:' ? https : http;

// noinspection JSCheckFunctionSignatures
agent.get(url, (res) => res.pipe(tar.x()));
