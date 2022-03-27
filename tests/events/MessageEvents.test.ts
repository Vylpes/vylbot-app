import { Collection, Message, MessageAttachment, TextChannel } from "discord.js";
import MessageEvents from "../../src/events/MessageEvents";

beforeEach(() => {
    process.env = {};
});

describe('MessageDelete', () => {
    test('Given message was in a guild AND user was NOT a bot, expect message deleted embed to be sent', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const messageAttachments = new Collection<string, MessageAttachment>([
            [
                "0",
                {
                    url: 'image0.png'
                } as unknown as MessageAttachment
            ],
            [
                "1",
                {
                    url: 'image1.png'
                } as unknown as MessageAttachment
            ]
        ]);

        const message = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            channel: {},
            content: 'Message Content',
            attachments: messageAttachments
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageDelete(message);

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageAuthorDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Message Deleted');
        expect(embed.fields.length).toBe(4);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');

        // Embed -> Channel Field
        const embedFieldChannel = embed.fields[1];

        expect(embedFieldChannel.name).toBe('Channel');
        expect(embedFieldChannel.value).toBe('[object Object]');

        // Embed -> Content Field
        const embedFieldContent = embed.fields[2];

        expect(embedFieldContent.name).toBe('Content');
        expect(embedFieldContent.value).toBe('```Message Content```');

        // Embed -> Attachments Field
        const embedFieldAttachments = embed.fields[3];

        expect(embedFieldAttachments.name).toBe('Attachments');
        expect(embedFieldAttachments.value).toBe('```image0.png\nimage1.png```');
    });

    test('Given message was not sent in a guild, expect execution stopped', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const messageAttachments = new Collection<string, MessageAttachment>([
            [
                "0",
                {
                    url: 'image0.png'
                } as unknown as MessageAttachment
            ],
            [
                "1",
                {
                    url: 'image1.png'
                } as unknown as MessageAttachment
            ]
        ]);

        const message = {
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            channel: {},
            content: 'Message Content',
            attachments: messageAttachments
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageDelete(message);

        expect(channelSend).not.toBeCalled();
        expect(memberGuildChannelsCacheFind).not.toBeCalled();
        expect(messageAuthorDisplayAvatarURL).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given author is a bot, expect execution stopped', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const messageAttachments = new Collection<string, MessageAttachment>([
            [
                "0",
                {
                    url: 'image0.png'
                } as unknown as MessageAttachment
            ],
            [
                "1",
                {
                    url: 'image1.png'
                } as unknown as MessageAttachment
            ]
        ]);

        const message = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: true,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            channel: {},
            content: 'Message Content',
            attachments: messageAttachments
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageDelete(message);

        expect(channelSend).not.toBeCalled();
        expect(memberGuildChannelsCacheFind).not.toBeCalled();
        expect(messageAuthorDisplayAvatarURL).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given message does not contain any attachments, expect attachments field to be omitted', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const messageAttachments = new Collection<string, MessageAttachment>([]);

        const message = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            channel: {},
            content: 'Message Content',
            attachments: messageAttachments
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageDelete(message);

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageAuthorDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Message Deleted');
        expect(embed.fields.length).toBe(3);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');

        // Embed -> Channel Field
        const embedFieldChannel = embed.fields[1];

        expect(embedFieldChannel.name).toBe('Channel');
        expect(embedFieldChannel.value).toBe('[object Object]');

        // Embed -> Content Field
        const embedFieldContent = embed.fields[2];

        expect(embedFieldContent.name).toBe('Content');
        expect(embedFieldContent.value).toBe('```Message Content```');
    });
});

describe('MessageUpdate', () => {
    test('Given message is in a guild AND user is not a bot AND the content has actually changed, e xpect log embed to be sent', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {
            content: 'Old Message'
        } as unknown as Message;

        const newMessage = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            content: 'New Message',
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageAuthorDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Message Edited');
        expect(embed.fields.length).toBe(4);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');
        expect(embedFieldUser.inline).toBeTruthy();

        // Embed -> Channel Field
        const embedFieldChannel = embed.fields[1];

        expect(embedFieldChannel.name).toBe('Channel');
        expect(embedFieldChannel.value).toBe('[object Object]');
        expect(embedFieldChannel.inline).toBeTruthy();

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[2];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('```Old Message```');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[3];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('```New Message```');
    });

    test('Given message was not in a guild, expect execution stopped', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {
            content: 'Old Message'
        } as unknown as Message;

        const newMessage = {
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            content: 'New Message',
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).not.toBeCalled();
        expect(memberGuildChannelsCacheFind).not.toBeCalled();
        expect(messageAuthorDisplayAvatarURL).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given author is a bot, expect execution stopped', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {
            content: 'Old Message'
        } as unknown as Message;

        const newMessage = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: true,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            content: 'New Message',
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).not.toBeCalled();
        expect(memberGuildChannelsCacheFind).not.toBeCalled();
        expect(messageAuthorDisplayAvatarURL).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given the message contents are the same, expect execution stopped', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {
            content: 'Message'
        } as unknown as Message;

        const newMessage = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            content: 'Message',
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).not.toBeCalled();
        expect(memberGuildChannelsCacheFind).not.toBeCalled();
        expect(messageAuthorDisplayAvatarURL).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given Old Message did not have a content, expect field to account for this', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {} as unknown as Message;

        const newMessage = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            content: 'New Message',
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageAuthorDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Message Edited');
        expect(embed.fields.length).toBe(4);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');
        expect(embedFieldUser.inline).toBeTruthy();

        // Embed -> Channel Field
        const embedFieldChannel = embed.fields[1];

        expect(embedFieldChannel.name).toBe('Channel');
        expect(embedFieldChannel.value).toBe('[object Object]');
        expect(embedFieldChannel.inline).toBeTruthy();

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[2];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('```*none*```');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[3];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('```New Message```');
    });

    test('Given New Message does not have a content, expect field to account for this', async () => {
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
        const messageAuthorDisplayAvatarURL = jest.fn();

        const oldMessage = {
            content: 'Old Message'
        } as unknown as Message;

        const newMessage = {
            guild: {
                channels: {
                    cache: {
                        find: memberGuildChannelsCacheFind
                    }
                }
            },
            author: {
                bot: false,
                displayAvatarURL: messageAuthorDisplayAvatarURL,
                tag: 'USERTAG'
            },
            channel: {},
        } as unknown as Message;

        const messageEvents = new MessageEvents();

        const result = await messageEvents.messageUpdate(oldMessage, newMessage);

        expect(channelSend).toBeCalledTimes(1);
        expect(memberGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageAuthorDisplayAvatarURL).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Message Edited');
        expect(embed.fields.length).toBe(4);

        // Embed -> User Field
        const embedFieldUser = embed.fields[0];

        expect(embedFieldUser.name).toBe('User');
        expect(embedFieldUser.value).toBe('[object Object] `USERTAG`');
        expect(embedFieldUser.inline).toBeTruthy();

        // Embed -> Channel Field
        const embedFieldChannel = embed.fields[1];

        expect(embedFieldChannel.name).toBe('Channel');
        expect(embedFieldChannel.value).toBe('[object Object]');
        expect(embedFieldChannel.inline).toBeTruthy();

        // Embed -> Before Field
        const embedFieldBefore = embed.fields[2];

        expect(embedFieldBefore.name).toBe('Before');
        expect(embedFieldBefore.value).toBe('```Old Message```');

        // Embed -> After Field
        const embedFieldAfter = embed.fields[3];

        expect(embedFieldAfter.name).toBe('After');
        expect(embedFieldAfter.value).toBe('```*none*```');
    });
});