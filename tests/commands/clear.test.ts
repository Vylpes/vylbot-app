beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test.todo("EXPECT values to be set");
});

describe('Execute', () => {
    test.todo("GIVEN input is valid, EXPECT messages to be cleared");

    test.todo("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN interaction.channel is null, EXPECT nothing to happen");

    test.todo("GIVEN totalClear input is NOT supplied, EXPECT invalid error");

    test.todo("GIVEN totalClear is less than or equal to 0, EXPECT invalid error");

    test.todo("GIVEN totalClear is greater than 100, EXPECT invalid error");

    test.todo("GIVEN channel is NOT manageable, EXPECT insufficient permissions error");
});