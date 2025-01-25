# VylBot App

Discord bot for Vylpes' Den Discord Server.

## Installation

Download the latest version from the [releases page](https://git.vylpes.xyz/rabbitlabs/vylbot-app/releases).

Copy the config template file and fill in the strings.

## Requirements

- NodeJS v20
- Yarn

## Usage

Install the dependencies and build the app:

```bash
yarn install
yarn build
```

Setup the database (Recommended to use the docker compose file)

```bash
docker compose up -d
```

Copy and edit the settings files

```bash
cp .env.template .env
# Edit the .env file
```

> **NOTE:** Make sure you do *not* check in these files! These contain sensitive information and should be treated as private.

Start the bot

```bash
yarn start
```