const vylbot = require('vylbot-core');
const config = require('./config.json');

const client = new vylbot.client(config);
client.start();