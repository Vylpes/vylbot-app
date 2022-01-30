import { GuildMember, TextChannel } from "discord.js";
import GuildMemberUpdate from "../../../src/events/MemberEvents/GuildMemberUpdate";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties are set', () => {
        const oldMember = {
            nickname: 'Old Nickname'
        } as unknown as GuildMember;
        
        const newMember = {
            nickname: 'New Nickname'
        } as unknown as GuildMember;

        const guildMemberUpdate = new GuildMemberUpdate(oldMember, newMember);

        expect(guildMemberUpdate.oldMember).toBe(oldMember);
        expect(guildMemberUpdate.newMember).toBe(newMember);
    });
});

describe('NicknameChanged', () => {
    test('Given nickname has changed from one to another, expect embed to be sent with both', () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const channelSend = jest.fn();

        const textChannel = {
            name: 'mod-logs',
            send: channelSend
        } as unknown as TextChannel;

        const memberGuildChannelsCacheFind = jest.fn()
            .mockReturnValue(textChannel);
        const memberUserDisplayAvatarURL = jest.fn();

        const oldMember = {
            nickname: 'Old Nickname'
        } as unknown as GuildMember;

        const newMember = {
            nickname: 'New Nickname',
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            user: {
                tag: 'USERTAG',
                id: 'USERID',
                displayAvatarURL: memberUserDisplayAvatarURL
            }
        } as unknown as GuildMember;

        const guildMemberUpdate = new GuildMemberUpdate(oldMember, newMember);

        const result = guildMemberUpdate.NicknameChanged();

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(memberUserDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Nickname Changed');
        expect(embed.footer?.text).toBe('Id: USERID');
        expect(embed.fields.length).toBe(3);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[1];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('Old Nickname');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[2];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('New Nickname');
    });

    test('Given old nickname was null, expect embed to say old nickname was none', () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const channelSend = jest.fn();

        const textChannel = {
            name: 'mod-logs',
            send: channelSend
        } as unknown as TextChannel;

        const memberGuildChannelsCacheFind = jest.fn()
            .mockReturnValue(textChannel);
        const memberUserDisplayAvatarURL = jest.fn();

        const oldMember = {} as unknown as GuildMember;

        const newMember = {
            nickname: 'New Nickname',
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            user: {
                tag: 'USERTAG',
                id: 'USERID',
                displayAvatarURL: memberUserDisplayAvatarURL
            }
        } as unknown as GuildMember;

        const guildMemberUpdate = new GuildMemberUpdate(oldMember, newMember);

        const result = guildMemberUpdate.NicknameChanged();

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(memberUserDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Nickname Changed');
        expect(embed.footer?.text).toBe('Id: USERID');
        expect(embed.fields.length).toBe(3);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[1];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('*none*');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[2];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('New Nickname');
    });

    test('Given new nickname was null, expect embed to say new nickname was none', () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const channelSend = jest.fn();

        const textChannel = {
            name: 'mod-logs',
            send: channelSend
        } as unknown as TextChannel;

        const memberGuildChannelsCacheFind = jest.fn()
            .mockReturnValue(textChannel);
        const memberUserDisplayAvatarURL = jest.fn();

        const oldMember = {
            nickname: 'Old Nickname'
        } as unknown as GuildMember;

        const newMember = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            user: {
                tag: 'USERTAG',
                id: 'USERID',
                displayAvatarURL: memberUserDisplayAvatarURL
            }
        } as unknown as GuildMember;

        const guildMemberUpdate = new GuildMemberUpdate(oldMember, newMember);

        const result = guildMemberUpdate.NicknameChanged();

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(memberUserDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Nickname Changed');
        expect(embed.footer?.text).toBe('Id: USERID');
        expect(embed.fields.length).toBe(3);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[1];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('Old Nickname');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[2];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('*none*');
    });
});