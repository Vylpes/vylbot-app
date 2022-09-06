import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import registry from "./registry";
import { Intents } from "discord.js";

dotenv.config();

const requiredConfigs: string[] = [
    "BOT_TOKEN",
    "BOT_VER",
    "BOT_AUTHOR",
    "BOT_DATE",
    "BOT_OWNERID",
];

requiredConfigs.forEach(config => {
    if (!process.env[config]) {
        throw `${config} is required in .env`;
    }
});

const client = new CoreClient([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
]);

registry.RegisterCommands();
registry.RegisterEvents();

client.start();