import { PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import Ban from "../../src/commands/ban";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values to be set', () => {
        const command = new Ban();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("ban");
        expect(commandBuilder.description).toBe("Ban a member from the server with an optional reason");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.BanMembers.toString());
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderTargetOption = commandBuilder.options[0] as SlashCommandUserOption;

        expect(commandBuilderTargetOption.name).toBe("target");
        expect(commandBuilderTargetOption.description).toBe("The user");
        expect(commandBuilderTargetOption.required).toBeTruthy();

        const commandBuilderReasonOption = commandBuilder.options[1] as SlashCommandStringOption;

        expect(commandBuilderReasonOption.name).toBe("reason");
        expect(commandBuilderReasonOption.description).toBe("The reason");
    });
});

describe('Execute', () => {
    test.todo('GIVEN command is valid, EXPECT user to be banned');

    test.todo("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guild is null, EXPECT nothing to happen");

    test.todo("GIVEN targetUser is null, EXPECT user not found error");

    test.todo("GIVEN targetUser.user is undefined, EXPECT user not found error");

    test.todo("GIVEN targetUser.member is undefined, EXPECT user not found error");

    test.todo("GIVEN reasonInput is null, EXPECT reason to be defaulted");

    test.todo("GIVEN reasonInput.value is null, EXPECT reason to be defaulted");

    test.todo("GIVEN user is not bannable, EXPECT insufficient permissions error");

    test.todo("GIVEN channels.log.mod setting is not set, EXPECT command to return");

    test.todo("GIVEN channel can NOT be found, EXPECT logEmbed not to be sent");
});