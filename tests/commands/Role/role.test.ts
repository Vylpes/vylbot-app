beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test.todo('EXPECT properties are set');
});

describe('Execute', () => {
    test.todo("GIVEN interaction is not a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN an invalid subcommand is given, EXPECT not found error");
});

describe("toggle", () => {
    test.todo("GIVEN user has the role, EXPECT role to be removed");

    test.todo("GIVEN user does not have the role, EXPECT role to be added")

    test.todo("GIVEN interaction.guild is null, EXPECT nothing to happen");

    test.todo("GIVEN interaction.member is null, EXPECT nothing to happen");

    test.todo("GIVEN requestedRole is null, EXPECT invalid error");

    test.todo("GIVEN requestedRole.role is undefined, EXPECT invalid error");

    test.todo("GIVEN role is not assignable, EXPECT unassignable error");

    test.todo("GIVEN assignRole is not foundm, EXPECT nothing to happen");

    test.todo("GIVEN assignRole is not editable, EXPECT insufficient permissions error");
});

describe("list", () => {
    test.todo("EXPECT role list to be sent");
});