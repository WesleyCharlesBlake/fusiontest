const request = require('request');
const qs = require('querystring');
const crypto = require('crypto');
const path = require('path');

const z = (val) => (`0${val}`).slice(-2);

const toUTCDate = (d) => {
  const parts = [d.getUTCFullYear()];
  parts.push(z(d.getUTCMonth() + 1));
  parts.push(z(d.getUTCDate()));
  parts.push(z(d.getUTCHours()));
  parts.push(z(d.getUTCMinutes()));
  return parts.join('-');
};

const calcDigest = (timestamp, salt, keystring) => {
  const byteArray = new Buffer(keystring, 'utf8');
  const shasum = crypto.createHash('sha1');
  shasum.update(byteArray);
  const digest = shasum.digest('base64');
  return encodeURIComponent(digest);
};

const tokenParams = (options) => {
  const timestamp = toUTCDate(new Date());
  const salt = Math.floor(Math.random() * 10000000000).toString();
  const keystring = `${timestamp}*${options.password}*${salt}`;
  const digest = calcDigest(timestamp, salt, keystring);
  return `clientId=${options.clientid}&timeStamp=${timestamp}&salt=${salt}&digest=${digest}`;
};

const post = (method, options, params, callback) => {
  const postData = `${qs.stringify(params || {})}&${tokenParams(options)}`;
  const postOptions = {
    baseUrl: options.host,
    uri: `${path.join(options.basepath, method)}?${postData}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ww-form-urlencoded',
    },
  };
  request(postOptions)
    .on('error', (err) => console.error(err))
    .on('data', (chunk) => (typeof callback === 'function') && callback(chunk.toString('utf8')));
};

module.exports = { post };
