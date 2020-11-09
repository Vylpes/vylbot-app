# VylBot App

Discord bot for Vylpes' Den Discord Server. Based on [VylBot Core](https://github.com/getgravitysoft/vylbot-core).

## Installation

Download the latest version from the [releases page](https://github.com/Vylpes/vylbot-app/releases).

Copy the config template file and fill in the strings.

```json
{
    "token": "",
    "prefix": "v!",
    "commands": [
        "essentials/commands",
        "commands"
    ],
    "events": [
        "events"
    ]
}
```

* **Token:** Your bot's token
* **Prefix** The command prefix
* **Commands:** An array of the folders which contain your commands
* **Events:** An array of the folders which contain your events

## Usage

Implement the client using something like:

```js
const vylbot = require('vylbot-core');
const config = require('./config.json');

const client = new vylbot.client(config);
client.start();
```

See the `docs` folder for more information on how to use vylbot-core