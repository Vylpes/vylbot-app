import { Guild, Message, TextChannel, User } from "discord.js";
import { ICommandContext } from "../../../src/contracts/ICommandContext";
import LogEmbed from "../../../src/helpers/embeds/LogEmbed";
import SettingsHelper from "../../../src/helpers/SettingsHelper";

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

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new LogEmbed(context, 'Log Message');

        expect(errorEmbed.color?.toString()).toBe('3166394'); // 0x3050ba in decimal
        expect(errorEmbed.title).toBe('Log Message');
        expect(errorEmbed.context).toBe(context);
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

        const user = {
            tag: 'USERTAG'
        } as unknown as User;

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            author: user
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new LogEmbed(context, 'Event Message');

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

        const user = {
            tag: 'USERTAG',
            displayAvatarURL: displayAvatarURL
        } as unknown as User;

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            author: user
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new LogEmbed(context, 'Event Message');

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

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            guild: guild
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new LogEmbed(context, 'Event Message');

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

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            guild: guild
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new LogEmbed(context, 'Event Message');

        errorEmbed.SendToChannel('channel-name');

        expect(guildChannelsCacheFind).toBeCalledTimes(1);
    });
});

describe('SendToMessageLogsChannel', () => {
    test('Given setting is set, expect SendToChannel to be called with value', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue("message-logs");

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToMessageLogsChannel();

        expect(sendToChannel).toBeCalledWith('message-logs');
        expect(getSetting).toBeCalledWith("channels.logs.message", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToMessageLogsChannel();

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

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToMemberLogsChannel();

        expect(sendToChannel).toBeCalledWith('member-logs');
        expect(getSetting).toBeCalledWith("channels.logs.member", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToMemberLogsChannel();

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

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToModLogsChannel();

        expect(sendToChannel).toBeCalledWith('mod-logs');
        expect(getSetting).toBeCalledWith("channels.logs.mod", "guildId");
    });

    test('Given setting is not set, expect function to return', async () => {
        const sendToChannel = jest.fn();
        const getSetting = jest.fn().mockResolvedValue(undefined);

        const guild = {
            id: "guildId"
        } as unknown as Guild;

        const message = {
            guild: guild
        } as Message;

        const context: ICommandContext = {
            name: 'log',
            args: [],
            message: message
        };

        SettingsHelper.GetSetting = getSetting;

        const logEmbed = new LogEmbed(context, 'Event Message');
        
        logEmbed.SendToChannel = sendToChannel;
        
        await logEmbed.SendToModLogsChannel();

        expect(sendToChannel).not.toBeCalled();
        expect(getSetting).toBeCalledWith("channels.logs.mod", "guildId");
    });
});