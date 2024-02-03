describe('constructor', () => {
    test.todo('EXPECT properties to be set');
});

describe('execute', () => {
    test.todo("GIVEN interaction is not a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN subcommand is invalid, EXPECT error");
});

describe('add', () => {
    test.todo("EXPECT command to be added to disabled list");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN commandName is null, EXPECT error");

    test.todo("GIVEN commandName.value is undefined, EXEPCT error");

    test.todo("GIVEN disabledCommandsString is empty, EXPECT empty disabledCommands array to be used");
});

describe("remove", () => {
    test.todo("EXPECT command to be removed from disabled list");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN commandName is null, EXPECT error");

    test.todo("GIVEN commandName.value is undefined, EXPECT error");

    test.todo("GIVEN disabledCommandsString is empty, EXPECT empty disabledCommands array to be used");

    test.todo("GIVEN instance of commandName is not found in disabledCommands array, EXPECT it not to try to remove it");
});