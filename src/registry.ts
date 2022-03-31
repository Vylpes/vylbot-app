import { CoreClient } from "./client/client";
import About from "./commands/about";
import Ban from "./commands/ban";
import Clear from "./commands/clear";
import Code from "./commands/code";
import Config from "./commands/config";
import Disable from "./commands/disable";
import Evaluate from "./commands/eval";
import Help from "./commands/help";
import Kick from "./commands/kick";
import Mute from "./commands/mute";
import Poll from "./commands/poll";
import Role from "./commands/role";
import Rules from "./commands/rules";
import Setup from "./commands/setup";
import Unmute from "./commands/unmute";
import Warn from "./commands/warn";
import MemberEvents from "./events/MemberEvents";
import MessageEvents from "./events/MessageEvents";

export default class Registry {
    public static RegisterCommands(client: CoreClient) {
        client.RegisterCommand("about", new About());
        client.RegisterCommand("ban", new Ban());
        client.RegisterCommand("clear", new Clear());
        client.RegisterCommand("eval", new Evaluate());
        client.RegisterCommand("help", new Help());
        client.RegisterCommand("kick", new Kick());
        client.RegisterCommand("mute", new Mute());
        client.RegisterCommand("poll", new Poll());
        client.RegisterCommand("role", new Role());
        client.RegisterCommand("rules", new Rules());
        client.RegisterCommand("unmute", new Unmute());
        client.RegisterCommand("warn", new Warn());
        client.RegisterCommand("setup", new Setup());
        client.RegisterCommand("config", new Config());
        client.RegisterCommand("code", new Code());
        client.RegisterCommand("disable", new Disable());
    }

    public static RegisterEvents(client: CoreClient) {
        client.RegisterEvent(new MemberEvents());
        client.RegisterEvent(new MessageEvents());
    }
}