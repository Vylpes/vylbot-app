beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test.todo('EXPECT values to be set');
});

describe('Execute', () => {
    test.todo("EXPECT user to be warned");

    test.todo("GIVEN interaction.guild is null, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN targetUser is null, EXPECT error");

    test.todo("GIVEN targetUser.user is undefined, EXPECT error");

    test.todo("GIVEN targetUser.member is undefined, EXPECT error");

    test.todo("GIVEN reasonInput is null, EXPECT reason to be defaulted");

    test.todo("GIVEN reasonInput.value is undefined, EXPECT reason to be defaulted");

    test.todo("GIVEN channels.logs.mod setting is not found, EXPECT command to return");

    test.todo("GIVEN channel is not found, EXPECT logEmbed to not be sent");
});