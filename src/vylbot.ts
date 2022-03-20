import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import registry from "./registry";

dotenv.config();

const requiredConfigs: string[] = [
];

requiredConfigs.forEach(config => {
    if (!process.env[config]) {
        throw `${config} is required in .env`;
    }
});

const client = new CoreClient();

registry.RegisterCommands(client);
registry.RegisterEvents(client);

client.start();