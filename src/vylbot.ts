import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import registry from "./registry";
import { IntentsBitField } from "discord.js";

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
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
]);

registry.RegisterCommands();
registry.RegisterEvents();

client.start();