import { Channel, Guild, GuildMember, Message, PartialDMChannel, PartialGuildMember, PartialMessage, GuildBan } from "discord.js";

export class Event {	
	public channelCreate(channel: Channel) {
		
	}
	
	public channelDelete(channel: Channel | PartialDMChannel) {
		
	}
	
	public channelUpdate(oldChannel: Channel, newChannel: Channel) {
		
	}
	
	public guildBanAdd(ban: GuildBan) {
		
	}
	
	public guildBanRemove(ban: GuildBan) {
		
	}
	
	public guildCreate(guild: Guild) {
		
	}
	
	public guildMemberAdd(member: GuildMember) {
		
	}
	
	public guildMemberRemove(member: GuildMember | PartialGuildMember) {
		
	}
	
	public guildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
		
	}
	
	public message(message: Message) {
		
	}
	
	public messageDelete(message: Message | PartialMessage) {
		
	}
	
	public messageUpdate(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
		
	}

	public ready() {

	}
}
