import { mock } from "jest-mock-extended";

import { GuildMember, Message, Role, TextChannel, User } from "discord.js";
import Mute from "../../src/commands/mute";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            ROLES_MODERATOR: 'Moderator'
        };

        const mute = new Mute();

        expect(mute._category).toBe("Moderation");
        expect(mute._roles.length).toBe(1);
        expect(mute._roles[0]).toBe('Moderator');
    });
});

describe('Execute', () => {
    test('Given user has permission, expect user to be given muted role', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: true,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildRolesCacheFind = jest.fn()
            .mockImplementation((callback): Role | undefined => {
                const result = callback(role);

                if (!result) {
                    return undefined;
                }

                return role;
            });
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: true,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).toBeCalledWith(user);
        expect(messageGuildRolesCacheFind).toBeCalledTimes(1);
        expect(messageGuildChannelsCacheFind).toBeCalledTimes(1);
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(member.roles.add).toBeCalledWith(role, 'Test Reason');
        
        expect(result.embeds.length).toBe(2);

        // Log Embed
        const logEmbed = result.embeds[0];

        expect(logEmbed.title).toBe('Member Muted');
        expect(logEmbed.fields.length).toBe(3);

        // Log Embed -> User Field
        const logEmbedUserField = logEmbed.fields[0];

        expect(logEmbedUserField.name).toBe('User');
        expect(logEmbedUserField.value).toBe('[object Object] `USERTAG`');
        expect(logEmbedUserField.inline).toBeTruthy();

        // Log Embed -> Moderator Field
        const logEmbedModeratorField = logEmbed.fields[1];

        expect(logEmbedModeratorField.name).toBe('Moderator');
        expect(logEmbedModeratorField.value).toBe('[object Object] `AUTHORTAG`');

        // Public Embed
        const publicEmbed = result.embeds[1];

        expect(publicEmbed.title).toBe('');
        expect(publicEmbed.description).toBe('[object Object] has been muted');
    });

    test('Given user did not mention a user, expect user not to exist', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: true,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(null);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildRolesCacheFind = jest.fn()
            .mockImplementation((callback): Role | undefined => {
                const result = callback(role);

                if (!result) {
                    return undefined;
                }

                return role;
            });
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: true,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).not.toBeCalled();
        expect(messageGuildRolesCacheFind).not.toBeCalled();
        expect(messageGuildChannelsCacheFind).not.toBeCalled();
        expect(messageChannelSend).toBeCalledTimes(1);
        
        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe('User does not exist');
    });

    test('Given member can not be found from user, expect user to not be in server', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: true,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(null);
        const messageGuildRolesCacheFind = jest.fn()
            .mockImplementation((callback): Role | undefined => {
                const result = callback(role);

                if (!result) {
                    return undefined;
                }

                return role;
            });
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: true,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).toBeCalledWith(user);
        expect(messageGuildRolesCacheFind).not.toBeCalled();
        expect(messageGuildChannelsCacheFind).not.toBeCalled();
        expect(messageChannelSend).toBeCalledTimes(1);
        
        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe('User is not in this server');
    });

    test('Given guild is unavailable, expect execution to stop', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: true,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildRolesCacheFind = jest.fn()
            .mockImplementation((callback): Role | undefined => {
                const result = callback(role);

                if (!result) {
                    return undefined;
                }

                return role;
            });
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: false,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).toBeCalledWith(user);
        expect(messageGuildRolesCacheFind).not.toBeCalled();
        expect(messageGuildChannelsCacheFind).not.toBeCalled();
        expect(messageChannelSend).not.toBeCalled();
        
        expect(result.embeds.length).toBe(0);
    });

    test('Given client can not manage user, expect insufficient permissions', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: false,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildRolesCacheFind = jest.fn()
            .mockImplementation((callback): Role | undefined => {
                const result = callback(role);

                if (!result) {
                    return undefined;
                }

                return role;
            });
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: true,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).toBeCalledWith(user);
        expect(messageGuildRolesCacheFind).not.toBeCalled();
        expect(messageGuildChannelsCacheFind).not.toBeCalled();
        expect(messageChannelSend).toBeCalledTimes(1);
        
        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe('Unable to do this action, am I missing permissions?');
    });

    test('Given muted role can not be found, expect role not found', async () => {
        process.env = {
            CHANNELS_LOGS_MOD: 'mod-logs',
            ROLES_MUTED: 'Muted'
        };

        const user = {
            displayAvatarURL: jest.fn(),
            tag: 'USERTAG'
        } as unknown as User;

        const messageAuthor = {
            tag: 'AUTHORTAG'
        } as unknown as User;

        const member = {
            manageable: true,
            roles: {
                add: jest.fn()
            }
        } as unknown as GuildMember;

        const role = {
            name: 'Muted'
        } as unknown as Role;

        const logChannel = {
            name: 'mod-logs',
            send: jest.fn()
        } as unknown as TextChannel;

        const messageMentionsUsersFirst = jest.fn()
            .mockReturnValue(user);
        const messageGuildMember = jest.fn()
            .mockReturnValue(member);
        const messageGuildRolesCacheFind = jest.fn()
            .mockReturnValue(undefined);
        const messageChannelSend = jest.fn();
        const messageGuildChannelsCacheFind = jest.fn()
            .mockImplementation((callback): TextChannel | undefined => {
                const result = callback(logChannel);

                if (!result) {
                    return undefined;
                }

                return logChannel;
            });

        const message = {
            mentions: {
                users: {
                    first: messageMentionsUsersFirst
                }
            },
            guild: {
                member: messageGuildMember,
                available: true,
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                },
                channels: {
                    cache: {
                        find: messageGuildChannelsCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            },
            author: messageAuthor
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'mute',
            args: ['USER', 'Test', 'Reason'],
            message: message
        };

        const mute = new Mute();

        const result = await mute.execute(context);

        expect(messageMentionsUsersFirst).toBeCalledTimes(1);
        expect(messageGuildMember).toBeCalledWith(user);
        expect(messageGuildRolesCacheFind).toBeCalledTimes(1);
        expect(messageGuildChannelsCacheFind).not.toBeCalled();
        expect(messageChannelSend).toBeCalledTimes(1);
        
        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe('Unable to find role');
    });
});