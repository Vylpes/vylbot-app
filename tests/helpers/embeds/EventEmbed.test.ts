import { Guild, Message, TextChannel, User } from "discord.js";
import { ICommandContext } from "../../../src/contracts/ICommandContext";
import EventEmbed from "../../../src/helpers/embeds/EventEmbed";
import SettingsHelper from "../../../src/helpers/SettingsHelper";

beforeEach(() => {
    process.env = {};
    jest.resetAllMocks();
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        const guild = {} as unknown as Guild;

        const errorEmbed = new EventEmbed(guild, 'Event Message');

        expect(errorEmbed.color?.toString()).toBe('3166394'); // 0x3050ba in decimal
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

describe('AddReason', () => {
    test('Given a non-empty string is supplied, expect field with message', () => {
        const guild = {} as Guild;

        const eventEmbed = new EventEmbed(guild, "Event Embed");

        eventEmbed.addField = jest.fn();

        eventEmbed.AddReason("Test reason");

        expect(eventEmbed.addField).toBeCalledWith("Reason", "Test reason");
    });

    test('Given an empty string is supplied, expect field with default message', () => {
        const guild = {} as Guild;

        const eventEmbed = new EventEmbed(guild, "Event Embed");

        eventEmbed.addField = jest.fn();

        eventEmbed.AddReason("");

        expect(eventEmbed.addField).toBeCalledWith("Reason", "*none*");
    });
});

describe('SendToChannel', () => {
    test('Given channel can be found, expect embed to be sent to that channel', () => {
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
    test('Given setting is set, expect SendToChannel to be called with value', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue("message-logs");

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToMessageLogsChannel();

        expect(sendToChannel).toBeCalledWith('message-logs');
        expect(getSetting).toBeCalledWith("channels.logs.message", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToMessageLogsChannel();

        expect(sendToChannel).not.toBeCalled();
        expect(getSetting).toBeCalledWith("channels.logs.message", "guildId");
    });
});

describe('SendToMemberLogsChannel', () => {
    test('Given setting is set, expect SendToChannel to be called with value', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue("member-logs");

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToMemberLogsChannel();

        expect(sendToChannel).toBeCalledWith('member-logs');
        expect(getSetting).toBeCalledWith("channels.logs.member", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToMemberLogsChannel();

        expect(sendToChannel).not.toBeCalled();
        expect(getSetting).toBeCalledWith("channels.logs.member", "guildId");
    });
});

describe('SendToModLogsChannel', () => {
    test('Given setting is set, expect SendToChannel to be called with value', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue("mod-logs");

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToModLogsChannel();

        expect(sendToChannel).toBeCalledWith('mod-logs');
        expect(getSetting).toBeCalledWith("channels.logs.mod", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        SettingsHelper.GetSetting = getSetting;

        const errorEmbed = new EventEmbed(guild, 'Event Message');
        
        errorEmbed.SendToChannel = sendToChannel;
        
        await errorEmbed.SendToModLogsChannel();

        expect(sendToChannel).not.toBeCalled();
        expect(getSetting).toBeCalledWith("channels.logs.mod", "guildId");
    });
});