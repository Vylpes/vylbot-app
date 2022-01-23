import { GuildMember, TextChannel, User } from "discord.js";
import MemberEvents from "../../src/events/MemberEvents";
import GuildMemberUpdate from "../../src/events/MemberEvents/GuildMemberUpdate";

describe('GuildMemberAdd', () => {
    test('When event is fired, expect embed to be sent to logs channel', () => {
        const currentDate = new Date();

        const textChannel = {
            send: jest.fn()
        } as unknown as TextChannel;

        const memberGuildChannelsCacheFind = jest.fn()
            .mockReturnValue(textChannel);
        const userDisplayAvatarURL = jest.fn();

        const guildUser = {
            tag: 'USERTAG',
            createdAt: currentDate,
            id: 'USERID',
            displayAvatarURL: userDisplayAvatarURL
        } as unknown as User;

        const guildMember = {
            user: guildUser,
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            }
        } as unknown as GuildMember;

        const memberEvents = new MemberEvents();

        const result = memberEvents.guildMemberAdd(guildMember);

        expect(textChannel.send).toBeCalledTimes(1);
        expect(userDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe("Member Joined");
        expect(embed.footer?.text).toBe("Id: USERID");
        expect(embed.fields.length).toBe(2);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe("User");
        expect(embedFieldUser.value).toBe("[object Object] `USERTAG`");
        expect(embedFieldUser.inline).toBeTruthy();

        // Embed -> Created Field
        const embedFieldCreated = embed.fields[1];

        expect(embedFieldCreated.name).toBe("Created");
        expect(embedFieldCreated.value).toBe(currentDate.toString());
    });
});

describe('GuildMemberRemove', () => {
    test('When event is fired, expect embed to be sent to logs channel', () => {
        const currentDate = new Date();

        const textChannel = {
            send: jest.fn()
        } as unknown as TextChannel;

        const memberGuildChannelsCacheFind = jest.fn()
            .mockReturnValue(textChannel);
        const userDisplayAvatarURL = jest.fn();

        const guildUser = {
            tag: 'USERTAG',
            createdAt: currentDate,
            id: 'USERID',
            displayAvatarURL: userDisplayAvatarURL
        } as unknown as User;

        const guildMember = {
            user: guildUser,
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            joinedAt: currentDate
        } as unknown as GuildMember;

        const memberEvents = new MemberEvents();

        const result = memberEvents.guildMemberRemove(guildMember);

        expect(textChannel.send).toBeCalledTimes(1);
        expect(userDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe("Member Left");
        expect(embed.footer?.text).toBe("Id: USERID");
        expect(embed.fields.length).toBe(2);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe("User");
        expect(embedFieldUser.value).toBe("[object Object] `USERTAG`");
        expect(embedFieldUser.inline).toBeTruthy();

        // Embed -> Joined Field
        const embedFieldJoined = embed.fields[1];

        expect(embedFieldJoined.name).toBe("Joined");
        expect(embedFieldJoined.value).toBe(currentDate.toString());
    });
});

describe('GuildMemberUpdate', () => {
    test('Given nicknames are the same, expect NicknameChanged NOT to be called', () => {
        const member = {
            nickname: 'member'
        } as unknown as GuildMember;

        const nicknameChanged = jest.fn();

        GuildMemberUpdate.prototype.NicknameChanged = nicknameChanged;

        const memberEvents = new MemberEvents();

        const result = memberEvents.guildMemberUpdate(member, member);

        expect(result.embeds.length).toBe(0);
        expect(nicknameChanged).not.toBeCalled();
    });

    test('Given nicknames are the different, expect NicknameChanged to be called', () => {
        const oldMember = {
            nickname: 'oldMember'
        } as unknown as GuildMember;

        const newMember = {
            nickname: 'newMember'
        } as unknown as GuildMember;

        const nicknameChanged = jest.fn();

        GuildMemberUpdate.prototype.NicknameChanged = nicknameChanged;

        const memberEvents = new MemberEvents();

        const result = memberEvents.guildMemberUpdate(oldMember, newMember);

        expect(result.embeds.length).toBe(0);
        expect(nicknameChanged).toBeCalledTimes(1);
    });
});