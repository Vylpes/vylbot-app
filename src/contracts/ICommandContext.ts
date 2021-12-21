import { Message } from "discord.js";

export interface ICommandContext {
	name: string;
	args: string[];
	message: Message;
}