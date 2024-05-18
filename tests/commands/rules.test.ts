import Command from "../../src/commands/rules";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('EXPECT properties to be set', () => {
        const command = new Command();

        expect(command.CommandBuilder).toMatchSnapshot();
    });
});

describe('Execute', () => {
    test.todo("GIVEN interaction is not a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN invalid subcommand is given, EXPECT invalid error");
});

describe("access", () => {
    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN rules.access.label setting is not supplied, EXPECT label to be defaulted");
});