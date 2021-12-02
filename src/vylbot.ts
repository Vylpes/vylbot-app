import { CoreClient } from "vylbot-core";
import * as dotenv from "dotenv";

dotenv.config();

const requiredConfigs = [
    "EMBED_COLOUR",
    "EMBED_COLOUR_ERROR",
    "ROLES_MODERATOR",
    "ROLES_MUTED",
    "CHANNELS_LOGS_MESSAGE",
    "CHANNELS_LOGS_MEMBER",
    "CHANNELS_LOGS_MOD",
    "COMMANDS_ROLE_ROLES"
];

requiredConfigs.forEach(config => {
    if (!process.env[config]) {
        throw `${config} is required in .env`;
    }
});

const client = new CoreClient();
client.start();