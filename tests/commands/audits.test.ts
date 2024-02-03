describe("constructor", () => {
    test.todo("EXPECT properties to be set");
});

describe('execute', () => {
    test.todo("GIVEN interaction is not a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN subcommand is invalid, EXPECT error");
});

describe("user", () => {
    test.todo("EXPECT audits for user to be sent");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN user is null, EXPECT error");

    test.todo("GIVEN audits null, EXPECT no audits to be displayed");

    test.todo("GIVEN audits length is 0, EXPECT no audits to be displayed");
});

describe("view", () => {
    test.todo("EXPECT specific audit defaults to be sent");

    test.todo("GIVEN interaction.guildId is null, expect nothing to happen");

    test.todo("GIVEN auditId is null, EXPECT error");

    test.todo("GIVEN auditId.value is undefined, EXPECT error");

    test.todo("GIVEN audit is not in database, EXPECT error");

    test.todo("GIVEN audit.Reason was not supplied, EXPECT reason to be defaulted");
});

describe("clear", () => {
    test.todo("EXPECT audit to be cleared");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN auditId is null, EXPECT error");

    test.todo("GIVEN auditId.value is undefined, EXPECT error");

    test.todo("GIVEN audit is not found, EXPECT error");
});

describe("add", () => {
    test.todo("EXPECT audit to be added");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN user is null, EXPECT error");

    test.todo("GIVEN auditType is null, EXPECT error");

    test.todo("GIVEN auditType.value is undefined, EXPECT error");

    test.todo("GIVEN reasonInput is null, EXPECT reason to be empty");

    test.todo("GIVEN reasonType.value is undefined, EXPECT reason to be empty");
});