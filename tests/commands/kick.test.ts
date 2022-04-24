import { mock } from "jest-mock-extended";

import { GuildMember, Message, TextChannel, User } from "discord.js";
import Kick from "../../src/commands/kick";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            ROLES_MODERATOR: "Moderator"
        };

        const kick = new Kick();

        expect(kick._category).toBe('Moderation');
        expect(kick._roles.length).toBe(1);
        expect(kick._roles[0]).toBe('Moderator');
    });
});

describe('Execute', () => {
    test('Given user has permission, expect user to be kicked', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: true,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER", "Test", "Reason"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).toBeCalledTimes(1);
        expect(member.kick).toBeCalledWith('Moderator: AUTHORTAG, Reason: Test Reason');

        expect(result.embeds.length).toBe(2);

        // Log Embed
        const logEmbed = result.embeds[0];

        expect(logEmbed.title).toBe('Member Kicked');
        expect(logEmbed.fields.length).toBe(3);
        
        // Log Embed -> User Field
        const logEmbedFieldUser = logEmbed.fields[0];

        expect(logEmbedFieldUser.name).toBe('User');
        expect(logEmbedFieldUser.value).toBe('[object Object] `USERTAG`');
        expect(logEmbedFieldUser.inline).toBeTruthy();

        // Log Embed -> Moderator Field
        const logEmbedFieldModerator = logEmbed.fields[1];

        expect(logEmbedFieldModerator.name).toBe('Moderator');
        expect(logEmbedFieldModerator.value).toBe('[object Object] `AUTHORTAG`');

        // Log Embed -> Reason Field
        const logEmbedFieldReason = logEmbed.fields[2];

        expect(logEmbedFieldReason.name).toBe('Reason');
        expect(logEmbedFieldReason.value).toBe('Test Reason');
    });

    test('Given moderator did not supply a reason, expect default reason to be added', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: true,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).toBeCalledTimes(1);
        expect(member.kick).toBeCalledWith('Moderator: AUTHORTAG, Reason: *none*');

        expect(result.embeds.length).toBe(2);

        // Log Embed
        const logEmbed = result.embeds[0];

        expect(logEmbed.title).toBe('Member Kicked');
        expect(logEmbed.fields.length).toBe(3);
        
        // Log Embed -> User Field
        const logEmbedFieldUser = logEmbed.fields[0];

        expect(logEmbedFieldUser.name).toBe('User');
        expect(logEmbedFieldUser.value).toBe('[object Object] `USERTAG`');
        expect(logEmbedFieldUser.inline).toBeTruthy();

        // Log Embed -> Moderator Field
        const logEmbedFieldModerator = logEmbed.fields[1];

        expect(logEmbedFieldModerator.name).toBe('Moderator');
        expect(logEmbedFieldModerator.value).toBe('[object Object] `AUTHORTAG`');

        // Log Embed -> Reason Field
        const logEmbedFieldReason = logEmbed.fields[2];

        expect(logEmbedFieldReason.name).toBe('Reason');
        expect(logEmbedFieldReason.value).toBe('*none*');
    });

    test('Given target user is not found, expect user does not exist error', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: true,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(null);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER", "Test", "Reason"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(member.kick).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe(null);
        expect(embed.description).toBe('User does not exist');
    });

    test('Given target member is not found, expect user is not in this server error', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: true,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
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
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER", "Test", "Reason"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(member.kick).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe(null);
        expect(embed.description).toBe('User is not in this server');
    });

    test('Given guild is not available, expect to stop', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: true,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER", "Test", "Reason"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).not.toBeCalled();
        expect(logChannel.send).not.toBeCalled();
        expect(member.kick).not.toBeCalled();

        expect(result.embeds.length).toBe(0);
    });

    test('Given client can not kick member, expect error', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs'
        }

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const member = {
            kickable: false,
            kick: jest.fn()
        } as unknown as GuildMember;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });
        const messageChannelSend = jest.fn();

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
                member: messageGuildMember,
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
            name: "kick",
            args: ["USER", "Test", "Reason"],
            message: message
        }

        const kick = new Kick();

        const result = await kick.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(logChannel.send).not.toBeCalled();
        expect(member.kick).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe(null);
        expect(embed.description).toBe('Unable to do this action, am I missing permissions?');
    });
});