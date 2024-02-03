describe("constructor", () => {
    test.todo("EXPECT properties to be set");
});

describe("execute", () => {
    test.todo("GIVEN interaction is not a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN server is not set up in the database, EXPECT error");

    test.todo("GIVEN subcommand is invalid, EXPECT error");
});

describe("list", () => {
    test.todo("EXPECT help text to be sent");
});

describe("reset", () => {
    test.todo("EXPECT setting value to be set to default");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN key is null, EXPECT error");

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN server is not found in database, EXPECT error");

    test.todo("GIVEN setting is not found, EXPECT error");
});

describe("get", () => {
    test.todo("EXPECT setting value to be sent");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN key is null, EXPECT error");

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN server can not be found in database, EXPECT error");

    test.todo("GIVEN setting can not be found AND a default value is found, EXPECT default to be shown");

    test.todo("GIVEN setting can not be found AND a default value is not found, EXPECT none to be shown");
});

describe("set", () => {
    test.todo("GIVEN setting already is set, EXPECT setting to be updated");

    test.todo("GIVEN setting is not set, EXPECT setting to be added");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN key is null, EXPECT error");

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN value is null, EXPECT error");

    test.todo("GIVEN value.value is undefined, EXPECT error");

    test.todo("GIVEN server can not be found in the database, EXPECT error");
});