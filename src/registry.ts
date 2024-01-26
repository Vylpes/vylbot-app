import { CoreClient } from "./client/client";
import { EventType } from "./constants/EventType";

// Command Imports
import About from "./commands/about";
import Audits from "./commands/audits";
import Ban from "./commands/ban";
import Bunny from "./commands/bunny";
import Clear from "./commands/clear";
import Code from "./commands/code";
import Config from "./commands/config";
import Disable from "./commands/disable";
import Ignore from "./commands/ignore";
import Kick from "./commands/kick";
import Mute from "./commands/mute";
import Poll from "./commands/poll";
import Role from "./commands/Role/role";
import ConfigRole from "./commands/Role/config";
import Rules from "./commands/rules";
import Setup from "./commands/setup";
import Timeout from "./commands/timeout";
import Unmute from "./commands/unmute";
import Warn from "./commands/warn";

// Command Imports: MankBot
import Entry from "./commands/501231711271780357/entry";
import Lobby from "./commands/501231711271780357/Lobby/lobby";
import AddLobby from "./commands/501231711271780357/Lobby/add";
import RemoveLobby from "./commands/501231711271780357/Lobby/remove";
import ListLobby from "./commands/501231711271780357/Lobby/list";

// Event Imports
import GuildMemberAdd from "./events/MemberEvents/GuildMemberAdd";
import GuildMemberRemove from "./events/MemberEvents/GuildMemberRemove";
import GuildMemberUpdate from "./events/MemberEvents/GuildMemberUpdate";
import MessageDelete from "./events/MessageEvents/MessageDelete";
import MessageUpdate from "./events/MessageEvents/MessageUpdate";
import MessageCreate from "./events/MessageEvents/MessageCreate";

// Button Event Imports
import Verify from "./buttonEvents/verify";

export default class Registry {
    public static RegisterCommands() {
        CoreClient.RegisterCommand("about", new About());
        CoreClient.RegisterCommand("audits", new Audits());
        CoreClient.RegisterCommand("ban", new Ban());
        CoreClient.RegisterCommand("bunny", new Bunny());
        CoreClient.RegisterCommand("clear", new Clear());
        CoreClient.RegisterCommand("code", new Code());
        CoreClient.RegisterCommand("config", new Config());
        CoreClient.RegisterCommand("disable", new Disable());
        CoreClient.RegisterCommand("ignore", new Ignore());
        CoreClient.RegisterCommand("kick", new Kick());
        CoreClient.RegisterCommand("mute", new Mute());
        CoreClient.RegisterCommand("poll", new Poll());
        CoreClient.RegisterCommand("rules", new Rules());
        CoreClient.RegisterCommand("setup", new Setup());
        CoreClient.RegisterCommand("timeout", new Timeout());
        CoreClient.RegisterCommand("unmute", new Unmute());
        CoreClient.RegisterCommand("warn", new Warn());

        CoreClient.RegisterCommand("role", new Role());
        CoreClient.RegisterCommand("configrole", new ConfigRole());

        // Exclusive Commands: MankBot
        CoreClient.RegisterCommand("lobby", new Lobby(), "501231711271780357");
        CoreClient.RegisterCommand("lobbyAdd", new AddLobby(), "501231711271780357");
        CoreClient.RegisterCommand("lobbyRemove", new RemoveLobby(), "501231711271780357");
        CoreClient.RegisterCommand("listlobby", new ListLobby(), "501231711271780357");
        CoreClient.RegisterCommand("entry", new Entry(), "501231711271780357");

        // Add Exclusive Commands to Test Server
        CoreClient.RegisterCommand("lobby", new Lobby(), "442730357897429002");
        CoreClient.RegisterCommand("addlobby", new AddLobby(), "442730357897429002");
        CoreClient.RegisterCommand("removelobby", new RemoveLobby(), "442730357897429002");
        CoreClient.RegisterCommand("listlobby", new ListLobby(), "442730357897429002");
        CoreClient.RegisterCommand("entry", new Entry(), "442730357897429002");
    }

    public static RegisterEvents() {
        CoreClient.RegisterEvent(EventType.GuildMemberAdd, GuildMemberAdd);
        CoreClient.RegisterEvent(EventType.GuildMemberRemove, GuildMemberRemove);
        CoreClient.RegisterEvent(EventType.GuildMemberUpdate, GuildMemberUpdate);

        CoreClient.RegisterEvent(EventType.MessageDelete, MessageDelete);
        CoreClient.RegisterEvent(EventType.MessageUpdate, MessageUpdate);
        CoreClient.RegisterEvent(EventType.MessageCreate, MessageCreate);
    }

    public static RegisterButtonEvents() {
        CoreClient.RegisterButtonEvent("verify", new Verify());
    }
}