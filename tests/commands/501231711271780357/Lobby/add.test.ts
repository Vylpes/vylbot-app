import { PermissionsBitField, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption } from "discord.js";
import Add from "../../../../src/commands/501231711271780357/Lobby/add";

describe('constuctor', () => {
    test("EXPECT properties to be set", () => {
        const add = new Add();

        expect(add.CommandBuilder).toBeDefined();

        const commandbuilder = add.CommandBuilder as SlashCommandBuilder;

        expect(commandbuilder.name).toBe("addlobby");
        expect(commandbuilder.description).toBe("Add lobby channel");
        expect(commandbuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());

        expect(commandbuilder.options.length).toBe(4);

        const channelOption = commandbuilder.options[0] as SlashCommandChannelOption;

        expect(channelOption.name).toBe("channel");
        expect(channelOption.description).toBe("The channel");
        expect(channelOption.required).toBe(true);

        const roleOption = commandbuilder.options[1] as SlashCommandRoleOption;

        expect(roleOption.name).toBe("role");
        expect(roleOption.description).toBe("The role to ping on request");
        expect(roleOption.required).toBe(true);

        const cooldownOption = commandbuilder.options[2] as SlashCommandNumberOption;

        expect(cooldownOption.name).toBe("cooldown");
        expect(cooldownOption.description).toBe("The cooldown in minutes");
        expect(cooldownOption.required).toBe(true);

        const nameOption = commandbuilder.options[3] as SlashCommandStringOption;

        expect(nameOption.name).toBe("name");
        expect(nameOption.description).toBe("The game name");
        expect(nameOption.required).toBe(true);
    });
});

describe('execute', () => {
    test.todo("EXPECT channel to be added to the lobby database table");

    test.todo("GIVEN channel is null, EXPECT error");

    test.todo("GIVEN channel.channel is undefined, EXPECT error");

    test.todo("GIVEN role is null, EXPECT error");

    test.todo("GIVEN role.role is undefined, EXPECT error");

    test.todo("GIVEN cooldown is null, EXPECT error");

    test.todo("GIVEN cooldown.value is undefined, EXPECT error");

    test.todo("GIVEN gameName is null, EXPECT error");

    test.todo("GIVEN gameName.value is undefined, EXPECT error");

    test.todo("GIVEN channel has already been set up in the database, EXPECT error");
});