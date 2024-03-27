import { CommandInteraction, GuildMemberRoleManager, SlashCommandBuilder, SlashCommandRoleOption, SlashCommandSubcommandBuilder } from "discord.js";
import Command from "../../../src/commands/Role/role";
import Role from "../../../src/database/entities/Role";
import { EmbedBuilder } from "@discordjs/builders";
import EmbedColours from "../../../src/constants/EmbedColours";

describe('Constructor', () => {
    test('EXPECT properties are set', () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("role");
        expect(commandBuilder.description).toBe("Toggle your roles");
        expect(commandBuilder.options.length).toBe(2);

        const toggleSubcommand = commandBuilder.options[0] as SlashCommandSubcommandBuilder;

        expect(toggleSubcommand.name).toBe("toggle");
        expect(toggleSubcommand.description).toBe("Toggle your role");
        expect(toggleSubcommand.options.length).toBe(1);

        const toggleRoleOption = toggleSubcommand.options[0] as SlashCommandRoleOption;

        expect(toggleRoleOption.name).toBe("role");
        expect(toggleRoleOption.description).toBe("The role name");
        expect(toggleRoleOption.required).toBe(true);

        const listSubcommand = commandBuilder.options[1] as SlashCommandSubcommandBuilder;

        expect(listSubcommand.name).toBe("list");
        expect(listSubcommand.description).toBe("List togglable roles");
    });
});

describe('Execute', () => {
    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN an invalid subcommand is given, EXPECT not found error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("other"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Subcommand not found.");
    });
});

describe("toggle", () => {
    test("GIVEN user has the role, EXPECT role to be removed", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const requestedRole = {
            role: {
                name: "roleName",
            },
        };

        const userRole = {};

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(Role.FetchAllByServerId).toHaveBeenCalledTimes(1);
        expect(Role.FetchAllByServerId).toHaveBeenCalledWith("guildId");

        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(2);
        
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("role");

        const roleManager = interaction.member!.roles as GuildMemberRoleManager;

        expect(roleManager.cache.find).toHaveBeenCalledTimes(1);
        expect(roleManager.remove).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Removed role: `roleName`");
    });

    test("GIVEN user does not have the role, EXPECT role to be added", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const requestedRole = {
            role: {
                name: "roleName",
            },
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(undefined),
                    },
                    add: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(Role.FetchAllByServerId).toHaveBeenCalledTimes(1);
        expect(Role.FetchAllByServerId).toHaveBeenCalledWith("guildId");

        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(2);
        
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("role");

        const roleManager = interaction.member!.roles as GuildMemberRoleManager;

        expect(roleManager.cache.find).toHaveBeenCalledTimes(1);
        expect(roleManager.add).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Gave role: `roleName`");
    })

    test("GIVEN interaction.guild is null, EXPECT nothing to happen", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const requestedRole = {
            role: {
                name: "roleName",
            },
        };

        const userRole = {};

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: null,
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    add: jest.fn(),
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();

        const roleManager = interaction.member!.roles as GuildMemberRoleManager;

        expect(roleManager.add).not.toHaveBeenCalled();
        expect(roleManager.remove).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.member is null, EXPECT nothing to happen", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const requestedRole = {
            role: {
                name: "roleName",
            },
        };

        const userRole = {};

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: null,
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    add: jest.fn(),
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();

        const roleManager = interaction.member!.roles as GuildMemberRoleManager;

        expect(roleManager.add).not.toHaveBeenCalled();
        expect(roleManager.remove).not.toHaveBeenCalled();
    });

    test("GIVEN requestedRole is null, EXPECT invalid error", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const userRole = {};

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(null),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN requestedRole.role is undefined, EXPECT invalid error", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: true,
        };

        const userRole = {};

        const requestedRole = {
            role: undefined,
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN assignRole is not editable, EXPECT insufficient permissions error", async () => {
        const role = {
            id: "roleId",
            name: "roleName",
            editable: false,
        };

        const userRole = {};

        const requestedRole = {
            role: {
                name: "roleName",
            },
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(userRole),
                    },
                    remove: jest.fn(),
                },
            },
            options: {
                get: jest.fn().mockReturnValue(requestedRole),
                getSubcommand: jest.fn().mockReturnValue("toggle"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([{}]);

        const command = new Command();
        await command.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Insufficient permissions. Please contact a moderator.");
    });
});

describe("list", () => {
    test("EXPECT role list to be sent", async () => {
        let repliedWith;

        const role = {
            name: "roleName",
        };

        const interaction = {
            guildId: "guildId",
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                }
            },
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("list"),
            },
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            }),
        } as unknown as CommandInteraction;

        Role.FetchAllByServerId = jest.fn().mockResolvedValue([role]);

        const command = new Command();
        await command.execute(interaction);

        expect(Role.FetchAllByServerId).toHaveBeenCalledTimes(1);
        expect(Role.FetchAllByServerId).toHaveBeenCalledWith("guildId");

        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);

        expect(repliedWith).toBeDefined();
        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds.length).toBe(1);

        const embed = repliedWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("Roles");
        expect(embed.data.description).toBe("Roles: 1\n\nroleName");
    });
});