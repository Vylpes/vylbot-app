import { MessageEmbed } from "discord.js";
import { ICommandContext } from "./ICommandContext";

export default interface ICommandReturnContext {
    embeds: MessageEmbed[]
}