import { CommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandRoleOption } from "discord.js";
import Config from "../../../src/commands/Role/config";
import Role from "../../../src/database/entities/Role";
import Server from "../../../src/database/entities/Server";

describe('constructor', () => {
    test('EXPECT properties to be set', () => {
        const config = new Config();

        expect(config.CommandBuilder).toBeDefined();

        const commandBuilder = config.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("configrole");
        expect(commandBuilder.description).toBe("Toggle your roles");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ManageRoles.toString());
        expect(commandBuilder.options.length).toBe(1);

        const roleOption = commandBuilder.options[0] as SlashCommandRoleOption;

        expect(roleOption.name).toBe("role");
        expect(roleOption.description).toBe("The role name");
        expect(roleOption.required).toBe(true);
    });
});

describe("execute", () => {
    test("GIVEN role is marked as assignable, EXPECT role to be removed", async () => {
        const role = {
            role: {
                id: "roleId",
            },
        };

        const interaction = {
            guildId: "guildId",
            guild: {},
            member: {},
            options: {
                get: jest.fn().mockReturnValue(role),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchOneByRoleId = jest.fn().mockResolvedValue({});
        Role.Remove = jest.fn();

        const config = new Config();
        await config.execute(interaction);

        expect(Role.FetchOneByRoleId).toHaveBeenCalledTimes(1);
        expect(Role.FetchOneByRoleId).toHaveBeenCalledWith("roleId");

        expect(Role.Remove).toHaveBeenCalledTimes(1);

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("role");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Removed role from configuration."); 
    });

    test("GIVEN role is not marked as assignable, EXPECT role to be added", async () => {
        let newRole: Role | undefined;

        const role = {
            role: {
                id: "roleId",
            },
        };

        const interaction = {
            guildId: "guildId",
            guild: {},
            member: {},
            options: {
                get: jest.fn().mockReturnValue(role),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchOneByRoleId = jest.fn().mockResolvedValue(null);
        Role.prototype.SetServer = jest.fn();
        Role.prototype.Save = jest.fn().mockImplementation((_, role) => {
            newRole = role;
        });

        Server.FetchOneById = jest.fn().mockResolvedValue({});

        const config = new Config();
        await config.execute(interaction);

        expect(Role.FetchOneByRoleId).toHaveBeenCalledTimes(1);
        expect(Role.FetchOneByRoleId).toHaveBeenCalledWith("roleId");

        expect(Role.prototype.SetServer).toHaveBeenCalledTimes(1);
        
        expect(Role.prototype.Save).toHaveBeenCalledTimes(1);
        expect(newRole).toBeDefined();
        expect(newRole!.RoleId).toBe("roleId");

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("role");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Added role to configuration."); 
    });

    test("GIVEN interaction.guildId is null, EXPECT error", async () => {
        const interaction = {
            guildId: null,
            options: {
                get: jest.fn(),
            }
        } as unknown as CommandInteraction;

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.options.get).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.guild is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            guild: null,
            options: {
                get: jest.fn(),
            }
        } as unknown as CommandInteraction;

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.options.get).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.member is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            guild: {},
            member: null,
            options: {
                get: jest.fn(),
            }
        } as unknown as CommandInteraction;

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.options.get).not.toHaveBeenCalled();
    });

    test("GIVEN role is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            guild: {},
            member: {},
            options: {
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN role.role is undefined, EXPECT error", async () => {
        const role = {
            role: null,
        }

        const interaction = {
            guildId: "guildId",
            guild: {},
            member: {},
            options: {
                get: jest.fn().mockReturnValue(role),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN server is not configured in the database, EXPECT error", async () => {
        let newRole: Role | undefined;

        const role = {
            role: {
                id: "roleId",
            },
        };

        const interaction = {
            guildId: "guildId",
            guild: {},
            member: {},
            options: {
                get: jest.fn().mockReturnValue(role),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Role.FetchOneByRoleId = jest.fn().mockResolvedValue(null);
        Role.prototype.SetServer = jest.fn();
        Role.prototype.Save = jest.fn().mockImplementation((_, role) => {
            newRole = role;
        });

        Server.FetchOneById = jest.fn().mockResolvedValue(null);

        const config = new Config();
        await config.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("This server has not been setup."); 
    });
});