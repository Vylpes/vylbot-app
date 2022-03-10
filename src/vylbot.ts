import { CoreClient } from "./client/client";
import * as dotenv from "dotenv";
import Register from "./Register";

dotenv.config();

const requiredConfigs: string[] = [
];

requiredConfigs.forEach(config => {
    if (!process.env[config]) {
        throw `${config} is required in .env`;
    }
});

const client = new CoreClient();

Register.RegisterCommands(client);
Register.RegisterEvents(client);

client.start();