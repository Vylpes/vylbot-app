import { CoreClient } from "vylbot-core";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure required data is in dotenv
if (!process.env.EMBED_COLOUR) throw "EMBED_COLOUR is required in .env";
if (!process.env.EMBED_COLOUR_ERROR) throw "EMBED_COLOUR_ERROR is required in .env";

if (!process.env.ROLES_MODERATOR) throw "ROLES_MODERATOR is required in .env";

if (!process.env.CHANNELS_LOGS_MESSAGE) throw "CHANNELS_LOGS_MESSAGE is required in .env";
if (!process.env.CHANNELS_LOGS_MEMBER) throw "CHANNELS_LOGS_MEMBER is required in .env";
if (!process.env.CHANNELS_LOGS_MOD) throw "CHANNELS_LOGS_MOD is required in .env";
if (!process.env.COMMANDS_MUTE_ROLE) throw "COMMANDS_MUTE_ROLE is required in .env";

const client = new CoreClient();
client.start();