#!/usr/bin/env nodejs
'use strict';

const fusion = require('./fusion.js');
const program = require('commander');
const chalk = require('chalk');

program
  .version('1.0.0')
  .option('-c, --clientid <clientid>', 'The client id supplied by Fusion (required)')
  .option('-p, --password <password>', 'The password supplied by Fusion (required)')
  .option('-H, --host [host]', 'The Fusion SyncStore endpoint url [https://za-feedstore.fusionagency.net]')
  .option('-v, --version [ver]', 'The Fusion SyncStore version [1]')
  .option('-t, --token [token]', 'Commit the commit token and get the next set of changes (optional)')
  .parse(process.argv);

const missing = [];
if (!program.clientid) missing.push('- clientid is required');
if (!program.password) missing.push('- password is required');

if (missing.length) {
  console.error(chalk.red(missing.join('\n')));
  return;
}

// defaults
const host = program.host || 'https://za-feedstore.fusionagency.net';
const basepath = `/v${program.ver || 1}/sync`;

const options = {
  clientid: parseInt(program.clientid, 10),
  password: program.password,
  host,
  basepath,
};
const params = program.token ? { commitToken: program.token } : null;

fusion.post('GetChanges', options, params, (chunk) => {
  console.log(chunk);
});
