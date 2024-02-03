beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test.todo('EXPECT properties to be set');
});

describe('Execute', () => {
    test.todo("GIVEN input is valid, EXPECT member to be kicked");

    test.todo("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guild is null, EXPECT nothing to happen");

    test.todo("GIVEN targetUser is null, EXPECT user not found error");

    test.todo("GIVEN targetUser.user is undefined, EXPECT user not found error");

    test.todo("GIVEN targetUser.member is undefined, EXPECT user not found error");

    test.todo("GIVEN reasonInput is null, EXPECT reason to be defaulted");

    test.todo("GIVEN reasonInput.value is undefined, EXPECT reason to be defaulted");

    test.todo("GIVEN user is not kickable, EXPECT insufficient permissions error");

    test.todo("GIVEN channels.logs.mod setting can not be found, EXPECT command to return");

    test.todo("GIVEN channel can not be found, EXPECT logEmbed not to be sent");
});