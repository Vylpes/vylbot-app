import { GuildMemberRoleManager, Message, Role as DiscordRole } from "discord.js";
import { mock } from "jest-mock-extended";
import Role from "../../src/commands/role";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties are set', () => {
        const role = new Role();

        expect(role._category).toBe("General");
    });
});

describe('Execute', () => {
    test('Given no arguments were given, expect SendRolesList to be executed', async () => {
        process.env = {
            COMMANDS_ROLE_ROLES: 'One,Two'
        };

        const message = {} as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: [],
            message: message
        };

        const role = new Role();

        role.SendRolesList = jest.fn();
        role.ToggleRole = jest.fn();

        await role.execute(context);

        expect(role.SendRolesList).toBeCalledWith(context, ['One', 'Two']);
        expect(role.ToggleRole).not.toBeCalled();
    });

    test('Given an argument was given, expect ToggleRole to be executed', async () => {
        process.env = {
            COMMANDS_ROLE_ROLES: 'One,Two'
        };

        const message = {} as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const role = new Role();

        role.SendRolesList = jest.fn();
        role.ToggleRole = jest.fn();

        await role.execute(context);

        expect(role.SendRolesList).not.toBeCalled();
        expect(role.ToggleRole).toBeCalledWith(context, ['One', 'Two']);
    });
});

describe('SendRolesList', () => {
    test('Expect embed with roles to be sent to the current channel', () => {
        process.env = {
            BOT_PREFIX: '!'
        };

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: [],
            message: message
        };

        const roles = ['One', 'Two'];

        const role = new Role();

        const result = role.SendRolesList(context, roles);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Roles');
        expect(embed.description).toBe('Do !role <role> to get the role!\nOne\nTwo');
    });
});

describe('ToggleRole', () => {
    test('Given role name is a valid role AND user does not have the role, expect role to be added', async () => {
        const discordRole = {} as unknown as DiscordRole;

        const messageMemberRolesCacheFind = jest.fn()
            .mockReturnValue(undefined);
        const messageGuildRolesCacheFind = jest.fn()
            .mockReturnValue(discordRole);
        const messageChannelSend = jest.fn();

        const message = {
            member: {
                roles: {
                    cache: {
                        find: messageMemberRolesCacheFind
                    }
                }
            },
            guild: {
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const roles = ['One', 'Two'];

        const role = new Role();

        role.AddRole = jest.fn();
        role.RemoveRole = jest.fn();

        const result = await role.ToggleRole(context, roles);

        expect(messageMemberRolesCacheFind).toBeCalledTimes(1);
        expect(messageGuildRolesCacheFind).toBeCalledTimes(1);
        expect(messageChannelSend).not.toBeCalled();
        expect(role.AddRole).toBeCalledWith(context, discordRole);
        expect(role.RemoveRole).not.toBeCalled();

        expect(result.embeds.length).toBe(0);
    });

    test('Given role name is a valid role AND user has the role, expect role to be removed', async () => {
        const discordRole = {} as unknown as DiscordRole;

        const messageMemberRolesCacheFind = jest.fn()
            .mockReturnValue(discordRole);
        const messageGuildRolesCacheFind = jest.fn()
            .mockReturnValue(discordRole);
        const messageChannelSend = jest.fn();

        const message = {
            member: {
                roles: {
                    cache: {
                        find: messageMemberRolesCacheFind
                    }
                }
            },
            guild: {
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const roles = ['One', 'Two'];

        const role = new Role();

        role.AddRole = jest.fn();
        role.RemoveRole = jest.fn();

        const result = await role.ToggleRole(context, roles);

        expect(messageMemberRolesCacheFind).toBeCalledTimes(1);
        expect(messageGuildRolesCacheFind).toBeCalledTimes(1);
        expect(messageChannelSend).not.toBeCalled();
        expect(role.AddRole).not.toBeCalled();
        expect(role.RemoveRole).toBeCalledWith(context, discordRole);

        expect(result.embeds.length).toBe(0);
    });

    test('Given role requested is not in the roles array, expect role not assignable error', async () => {
        const discordRole = {} as unknown as DiscordRole;

        const messageMemberRolesCacheFind = jest.fn()
            .mockReturnValue(undefined);
        const messageGuildRolesCacheFind = jest.fn()
            .mockReturnValue(discordRole);
        const messageChannelSend = jest.fn();

        const message = {
            member: {
                roles: {
                    cache: {
                        find: messageMemberRolesCacheFind
                    }
                }
            },
            guild: {
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['Three'],
            message: message
        };

        const roles = ['One', 'Two'];

        const role = new Role();

        role.AddRole = jest.fn();
        role.RemoveRole = jest.fn();

        const result = await role.ToggleRole(context, roles);

        expect(messageMemberRolesCacheFind).not.toBeCalled();
        expect(messageGuildRolesCacheFind).not.toBeCalled();
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(role.AddRole).not.toBeCalled();
        expect(role.RemoveRole).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe("This role isn't marked as assignable, to see a list of assignable roles, run this command without any parameters");
    });

    test('Given the role is not in the guild, expect error', async () => {
        const discordRole = {} as unknown as DiscordRole;

        const messageMemberRolesCacheFind = jest.fn()
            .mockReturnValue(undefined);
        const messageGuildRolesCacheFind = jest.fn()
            .mockReturnValue(undefined);
        const messageChannelSend = jest.fn();

        const message = {
            member: {
                roles: {
                    cache: {
                        find: messageMemberRolesCacheFind
                    }
                }
            },
            guild: {
                roles: {
                    cache: {
                        find: messageGuildRolesCacheFind
                    }
                }
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const roles = ['One', 'Two'];

        const role = new Role();

        role.AddRole = jest.fn();
        role.RemoveRole = jest.fn();

        const result = await role.ToggleRole(context, roles);

        expect(messageMemberRolesCacheFind).not.toBeCalled();
        expect(messageGuildRolesCacheFind).toBeCalledTimes(1);
        expect(messageChannelSend).toBeCalledTimes(1);
        expect(role.AddRole).not.toBeCalled();
        expect(role.RemoveRole).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe("The current server doesn't have this role. Please contact the server's moderators");
    });
});

describe('AddRole', () => {
    test('Expect role to be added to user', async () => {
        const messageChannelSend = jest.fn();

        const guildMemberRoleManager = mock<GuildMemberRoleManager>();

        const message = {
            member: {
                roles: guildMemberRoleManager
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const discordRole = {
            name: 'One'
        } as unknown as DiscordRole;

        const role = new Role();

        const result = await role.AddRole(context, discordRole);

        expect(guildMemberRoleManager.add).toBeCalledWith(discordRole);
        expect(messageChannelSend).toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('');
        expect(embed.description).toBe('Gave role: One');
    });
});

describe('RemoveRole', () => {
    test('Expect role to be removed from user', async () => {
        const messageChannelSend = jest.fn();

        const guildMemberRoleManager = mock<GuildMemberRoleManager>();

        const message = {
            member: {
                roles: guildMemberRoleManager
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'role',
            args: ['One'],
            message: message
        };

        const discordRole = {
            name: 'One'
        } as unknown as DiscordRole;

        const role = new Role();

        const result = await role.RemoveRole(context, discordRole);

        expect(guildMemberRoleManager.remove).toBeCalledWith(discordRole);
        expect(messageChannelSend).toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('');
        expect(embed.description).toBe('Removed role: One');
    });
});