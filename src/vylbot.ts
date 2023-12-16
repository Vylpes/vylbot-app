import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import registry from "./registry";
import { IntentsBitField, Partials } from "discord.js";

dotenv.config();

const requiredConfigs: string[] = [
    "BOT_TOKEN",
    "BOT_VER",
    "BOT_AUTHOR",
    "BOT_OWNERID",
    "BOT_CLIENTID",
    "DB_HOST",
    "DB_PORT",
    "DB_AUTH_USER",
    "DB_AUTH_PASS",
    "DB_SYNC",
    "DB_LOGGING",
];

requiredConfigs.forEach(config => {
    if (!process.env[config]) {
        throw `${config} is required in .env`;
    }
});

const client = new CoreClient([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
], [
    Partials.GuildMember,
    Partials.User,
]);

registry.RegisterCommands();
registry.RegisterEvents();

client.start();
