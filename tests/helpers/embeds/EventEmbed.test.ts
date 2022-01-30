import { Guild, Message, TextChannel, User } from "discord.js";
import { ICommandContext } from "../../../src/contracts/ICommandContext";
import EventEmbed from "../../../src/helpers/embeds/EventEmbed";

beforeEach(() => {
    process.env = {};
    jest.resetAllMocks();
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const guild = {} as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        expect(errorEmbed.color?.toString()).toBe('13969411'); // 0xd52803 in decimal
        expect(errorEmbed.title).toBe('Event Message');
        expect(errorEmbed.guild).toBe(guild);
    });
});

describe('AddUser', () => {
    test('Given setThumbnail is false, add field WITHOUT user thumbnail', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const addField = jest.fn();
        const setThumbnail = jest.fn();

        const guild = {} as unknown as Guild;

        const user = {
            tag: 'USERTAG'
        } as unknown as User;

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        errorEmbed.addField = addField;
        errorEmbed.setThumbnail = setThumbnail;

        errorEmbed.AddUser('User', user);

        expect(addField).toBeCalledWith('User', '[object Object] `USERTAG`', true);
        expect(setThumbnail).not.toBeCalled();
    });

    test('Given setThumbnail is true, add field WITH user thumbnail', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const addField = jest.fn();
        const setThumbnail = jest.fn();
        const displayAvatarURL = jest.fn()
            .mockReturnValue('image0.png');

        const guild = {} as unknown as Guild;

        const user = {
            tag: 'USERTAG',
            displayAvatarURL: displayAvatarURL
        } as unknown as User;

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        errorEmbed.addField = addField;
        errorEmbed.setThumbnail = setThumbnail;

        errorEmbed.AddUser('User', user, true);

        expect(addField).toBeCalledWith('User', '[object Object] `USERTAG`', true);
        expect(setThumbnail).toBeCalledWith('image0.png');
        expect(displayAvatarURL).toBeCalled();
    });
});

describe('SendToChannel', () => {
    test('Given channel can be found, expect embed to be sent to that channel', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const channelSend = jest.fn();

        const channel = {
            send: channelSend
        } as unknown as TextChannel;

        const guildChannelsCacheFind = jest.fn()
            .mockReturnValue(channel);

        const guild = {
            channels: {
                cache: {
                    find: guildChannelsCacheFind
                }
            }
        } as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        errorEmbed.SendToChannel('channel-name');

        expect(guildChannelsCacheFind).toBeCalledTimes(1);
        expect(channelSend).toBeCalledWith(errorEmbed);
    });

    test('Given channel can NOT be found, expect error logged', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const guildChannelsCacheFind = jest.fn()
            .mockReturnValue(null);

        const guild = {
            channels: {
                cache: {
                    find: guildChannelsCacheFind
                }
            }
        } as unknown as Guild;

        console.error = jest.fn();

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        errorEmbed.SendToChannel('channel-name');

        expect(guildChannelsCacheFind).toBeCalledTimes(1);
        expect(console.error).toBeCalledWith('Unable to find channel channel-name');
    });
});

describe('SendToMessageLogsChannel', () => {
    describe('Expect SendToChannel caleld with CHANNELS_LOGS_MESSAGE as parameter', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const sendToChannel = jest.fn();

        const guild = {} as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        errorEmbed.SendToMessageLogsChannel();

        expect(sendToChannel).toBeCalledWith('message-logs');
    });
});

describe('SendToMemberLogsChannel', () => {
    describe('Expect SendToChannel caleld with CHANNELS_LOGS_MEMBER as parameter', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const sendToChannel = jest.fn();

        const guild = {} as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        errorEmbed.SendToMemberLogsChannel();

        expect(sendToChannel).toBeCalledWith('member-logs');
    });
});

describe('SendToModLogsChannel', () => {
    describe('Expect SendToChannel caleld with CHANNELS_LOGS_MOD as parameter', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const sendToChannel = jest.fn();

        const guild = {} as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        errorEmbed.SendToModLogsChannel();

        expect(sendToChannel).toBeCalledWith('mod-logs');
    });
});