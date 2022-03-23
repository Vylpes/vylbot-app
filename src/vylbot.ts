import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import registry from "./registry";

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

const devmode = process.argv.find(x => x.toLowerCase() == "--dev") != null;

const client = new CoreClient(devmode);

registry.RegisterCommands(client);
registry.RegisterEvents(client);

client.start();