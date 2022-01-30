import { GuildMember, Message, TextChannel, User } from "discord.js";
import Ban from "../../src/commands/ban";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values to be set', () => {
        process.env.ROLES_MODERATOR = 'Moderator';

        const ban = new Ban();

        expect(ban._category).toBe('Moderation');
        expect(ban._roles.length).toBe(1);
        expect(ban._roles[0]).toBe('Moderator');
    });
});

describe('Execute', () => {
    test('Given user has permission, expect user to be banned', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);
        
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).toBeCalledTimes(1);
        expect(mentionedMember.ban).toBeCalledWith({ reason: 'Test Reason' });
    });

    test('Given user has permissions, expect embeds to be correct', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);

        expect(result.embeds.length).toBe(2);

        const logEmbed = result.embeds[0];
        const publicEmbed = result.embeds[1];

        expect(logEmbed.title).toBe('Member Banned');
        expect(publicEmbed.title).toBe("");
        expect(publicEmbed.description).toBe('[object Object] has been banned');
        expect(logEmbed.fields.length).toBe(3);
        expect(publicEmbed.fields.length).toBe(0);
    });

    test('Given user has permission, expect logEmbed fields to be correct', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn().mockReturnValue('URL'),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);

        const logEmbed = result.embeds[0];

        const fieldUser = logEmbed.fields[0];
        const fieldModerator = logEmbed.fields[1];
        const fieldReason = logEmbed.fields[2];

        expect(fieldUser.name).toBe("User");
        expect(fieldUser.value).toBe("[object Object] `USERTAG`");
        expect(logEmbed.thumbnail?.url).toBe("URL");

        expect(fieldModerator.name).toBe('Moderator');
        expect(fieldModerator.value).toBe('[object Object] `AUTHORTAG`');

        expect(fieldReason.name).toBe('Reason');
        expect(fieldReason.value).toBe('Test Reason');
    });

    test('Given user is not mentioned, expect error embed to be sent', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(null);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);
        
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(mentionedMember.ban).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        const embedError = result.embeds[0];

        expect(embedError.description).toBe('User does not exist');
    });

    test('Given member is not in server, expect error embed to be sent', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(null);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);
        
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(mentionedMember.ban).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        const embedError = result.embeds[0];

        expect(embedError.description).toBe('User is not in this server');
    });

    test('Given guild is unavailable, expect return and do nothing', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: true,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: false
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);
        
        expect(messageChannelSend).not.toBeCalled();
        expect(logChannel.send).not.toBeCalled();
        expect(mentionedMember.ban).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given bot cant ban user, expect error embed to be sent', async () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator',
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const mentionedUser = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;
        const mentionedMember = {
            bannable: false,
            ban: jest.fn()
        } as unknown as GuildMember;
        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageChannelSend = jest.fn();
        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(mentionedUser);
        const messageGuildMember = jest.fn()
            .mockReturnValue(mentionedMember);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            channel: {
                send: messageChannelSend
            },
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember ,
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                },
                available: true
            },
            author: {
                tag: 'AUTHORTAG'
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'ban',
            args: ['ban', 'Test', 'Reason'],
            message: message
        };

        const ban = new Ban();

        const result = await ban.execute(context);
        
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(mentionedMember.ban).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        const embedError = result.embeds[0];

        expect(embedError.description).toBe('Unable to do this action, am I missing permissions?');
    });
});