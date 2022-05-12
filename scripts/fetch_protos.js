const {http, https} = require('follow-redirects');
const fs = require('fs');
const tar = require('tar');

const config = require('../config.json');

fs.mkdirSync('cogment/api', {recursive: true});
process.chdir('cogment');

const url = new URL(config.cogmentApi);
const agent = url.protocol === 'https:' ? https : http;

// noinspection JSCheckFunctionSignatures
agent.get(url, (res) => res.pipe(tar.x()));
