#!/usr/bin/env node
'use strict';

const fusion = require('./fusion.js');
const program = require('commander');
require('log-buffer');

program
  .version('1.0.0')
  .option('-c, --clientid <clientid>', 'The client id supplied by Fusion')
  .option('-p, --password <password>', 'The password supplied by Fusion')
  .option('-H, --host [host]', 'The Fusion SyncStore endpoint url [https://za-feedstore.fusionagency.net]')
  .option('-v, --version [ver]', 'The Fusion SyncStore version [1]')
  .option('--commit [token]', 'Optionally commit the commit token and get the next set of changes')
  .parse(process.argv);

// some defaults
const host = program.host || 'https://za-feedstore.fusionagency.net';
const basepath = `/v${program.ver || 1}/sync`;

const getChanges = (options, params) => {
  fusion.post('GetChanges', options, params, (data) => {
    console.log(data);
  });
};

const options = {
  clientid: parseInt(program.clientid, 10),
  password: program.password,
  host,
  basepath,
  commit: !!program.commit,
};

const params = program.token ? { commitToken: program.token } : null;
getChanges(options, params);
