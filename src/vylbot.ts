import { CoreClient } from "vylbot-core";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.EMBED_COLOUR) throw "EMBED_COLOUR is required in .env";

const client = new CoreClient();
client.start();