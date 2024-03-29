#! /bin/bash

export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.nodeuse/bin:$PATH"

export BOT_TOKEN=$(cat $HOME/scripts/vylbot/prod_key.txt)

cd ~/apps/vylbot/vylbot_prod \
&& git checkout main \
&& git fetch \
&& git pull \
&& docker compose --file docker-compose.prod.yml down \
&& (pm2 stop vylbot_prod || true) \
&& (pm2 delete vylbot_prod || true) \
&& cp .prod.env .env \
&& yarn clean \
&& yarn install --frozen-lockfile \
&& yarn build \
&& docker compose --file docker-compose.prod.yml up -d \
&& echo "Sleeping for 10 seconds to let database load..." \
&& sleep 10 \
&& yarn run db:up \
&& NODE_ENV=production pm2 start --name vylbot_prod dist/vylbot.js