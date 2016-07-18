#!/usr/bin/env node
'use strict';

const request = require('request');
const qs = require('querystring');
const program = require('commander');
const crypto = require('crypto');
const path = require('path');
const logbuffer = { flush() {} }; //require('log-buffer');

const z = function(val) {
  return ('0' + val).slice(-2);
};

const toUTCDate = function(d) {
  return (d.getUTCFullYear()) + '-' + (z(d.getUTCMonth() + 1)) + '-' + (z(d.getUTCDate())) + '-' + (z(d.getUTCHours())) + '-' + (z(d.getUTCMinutes()));
};

const calcDigest = function(timestamp, salt, keystring) {
  var byteArray, digest, shasum;
  byteArray = new Buffer(keystring, 'utf8');
  shasum = crypto.createHash('sha1');
  shasum.update(byteArray);
  digest = shasum.digest('base64');
  return encodeURIComponent(digest);
};

const tokenParams = function(options) {
  var digest, keystring, salt, timestamp;
  timestamp = toUTCDate(new Date());
  salt = Math.floor(Math.random() * 10000000000).toString();
  keystring = timestamp + '*' + options.password + '*' + salt;
  digest = calcDigest(timestamp, salt, keystring);
  return 'clientId=' + options.clientid + '&timeStamp=' + timestamp + '&salt=' + salt + '&digest=' + digest;
};

const post = function(method, options, params, callback) {
  var post_data, post_options, post_req;
  post_data = qs.stringify(params || {}) + '&' + tokenParams(options);
  post_options = {
    baseUrl: options.host,
    uri: path.join(options.basepath, method) + '?' + post_data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ww-form-urlencoded'
    }
  };
  request(post_options)
    .on('error', (err) => console.error(err) )
    .on('data', (chunk) => (typeof callback === 'function') && callback(chunk.toString('utf8')));
};

const getChanges = function(options, params, callback) {
  post('GetChanges', options, params, function(data) {
    console.log(data);
  });
};

program
  .version('0.0.1')
  .option('-c, --clientid <clientid>', 'The client id supplied by Fusion')
  .option('-p, --password <password>', 'The password supplied by Fusion')
  .option('-H, --host [host]', 'The Fusion SyncStore endpoint url')
  .option('-v, --version [ver]', 'The Fusion SyncStore version')
  // .option('--commit', 'Commit the commit token afterwards?')
  .parse(process.argv);

const host = program.host || 'https://za-feedstore.fusionagency.net';
const basepath = `/v${program.ver || 1}/sync`;

const options = {
  clientid: parseInt(program.clientid,10),
  password: program.password,
  host,
  basepath,
  commit: !!program.commit
};

getChanges(options, null, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
});
