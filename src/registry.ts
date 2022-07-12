import { CoreClient } from "./client/client";

// Command Imports
import About from "./commands/about";
import Ban from "./commands/ban";
import Clear from "./commands/clear";
import Code from "./commands/code";
import Config from "./commands/config";
import Disable from "./commands/disable";
import Help from "./commands/help";
import Ignore from "./commands/ignore";
import Kick from "./commands/kick";
import Mute from "./commands/mute";
import Poll from "./commands/poll";
import Role from "./commands/role";
import Rules from "./commands/rules";
import Setup from "./commands/setup";
import Unmute from "./commands/unmute";
import Warn from "./commands/warn";

// Command Imports: MankBot
import Entry from "./commands/501231711271780357/entry";
import Lobby from "./commands/501231711271780357/lobby";

// Event Imports
import MemberEvents from "./events/MemberEvents";
import MessageEvents from "./events/MessageEvents";
import Bunny from "./commands/bunny";

export default class Registry {
    public static RegisterCommands() {
        CoreClient.RegisterCommand("about", new About());
        CoreClient.RegisterCommand("ban", new Ban());
        CoreClient.RegisterCommand("bunny", new Bunny());
        CoreClient.RegisterCommand("clear", new Clear());
        CoreClient.RegisterCommand("code", new Code());
        CoreClient.RegisterCommand("config", new Config());
        CoreClient.RegisterCommand("disable", new Disable());
        CoreClient.RegisterCommand("help", new Help());
        CoreClient.RegisterCommand("ignore", new Ignore());
        CoreClient.RegisterCommand("kick", new Kick());
        CoreClient.RegisterCommand("mute", new Mute());
        CoreClient.RegisterCommand("poll", new Poll());
        CoreClient.RegisterCommand("role", new Role());
        CoreClient.RegisterCommand("rules", new Rules());
        CoreClient.RegisterCommand("unmute", new Unmute());
        CoreClient.RegisterCommand("warn", new Warn());
        CoreClient.RegisterCommand("setup", new Setup());

        // Exclusive Commands: MankBot
        CoreClient.RegisterCommand("lobby", new Lobby(), "501231711271780357");
        CoreClient.RegisterCommand("entry", new Entry(), "501231711271780357");

        // Add Exclusive Commands to Test Server
        CoreClient.RegisterCommand("lobby", new Lobby(), "442730357897429002");
        CoreClient.RegisterCommand("entry", new Entry(), "442730357897429002");
    }

    public static RegisterEvents() {
        CoreClient.RegisterEvent(new MemberEvents());
        CoreClient.RegisterEvent(new MessageEvents());
    }
}