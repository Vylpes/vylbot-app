#! /bin/bash

export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.nvm/versions/node/v16.17.0/bin/:$PATH"

export BOT_TOKEN=$(cat $HOME/scripts/vylbot/stage_key.txt)

cd ~/apps/vylbot/vylbot_stage \
&& git checkout develop \
&& git fetch \
&& git pull \
&& docker-compose --file docker-compose.stage.yml down \
&& (pm2 stop vylbot_stage || true) \
&& (pm2 delete vylbot_stage || true) \
&& cp .stage.env .env \
&& cp ormconfig.stage.json ormconfig.json \
&& yarn install --frozen-lockfile \
&& yarn build \
&& docker-compose --file docker-compose.stage.yml up -d \
&& echo "Sleeping for 10 seconds to let database load..." \
&& sleep 10 \
&& yarn run db:up \
&& NODE_ENV=production pm2 start --name vylbot_stage dist/vylbot.js