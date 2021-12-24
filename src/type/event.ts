import { Channel, Guild, User, GuildMember, Message, PartialDMChannel, PartialGuildMember, PartialMessage } from "discord.js";

export class Event {	
	public channelCreate(channel: Channel) {
		
	}
	
	public channelDelete(channel: Channel | PartialDMChannel) {
		
	}
	
	public channelUpdate(oldChannel: Channel, newChannel: Channel) {
		
	}
	
	public guildBanAdd(guild: Guild, user: User) {
		
	}
	
	public guildBanRemove(guild: Guild, user: User) {
		
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
