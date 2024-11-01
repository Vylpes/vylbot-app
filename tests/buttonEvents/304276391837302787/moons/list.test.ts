describe("GIVEN interaction.guild is null", () => {
    test.todo("EXPECT function to return");
});

describe("GIVEN userId parameter is undefined", () => {
    test.todo("EXPECT function to return");
});

describe("GIVEN page parameter is undefined", () => {
    test.todo("EXPECT function to return");
});

describe("GIVEN no moons for the user is returned", () => {
    test.todo("EXPECT error replied");
});

describe("GIVEN no moons on current page", () => {
    test.todo("EXPECT description to say so");
});

describe("GIVEN happy flow", () => {
    test.todo("EXPECT moons to be fetched");

    test.todo("EXPECT embed to be updated");

    test.todo("EXPECT row to be updated");

    describe("GIVEN it is the first page", () => {
        test.todo("EXPECT Previous button to be disabled");
    });

    describe("GIVEN it is the last page", () => {
        test.todo("EXPECT Next button to be disabled");

        describe("GIVEN there are more moons in the counter than in the database", () => {
            test.todo("EXPECT untracked counter to be present");
        });
    });

    describe("GIVEN no moons on the current page", () => {
        test.todo("EXPECT Next button to be disabled");
    });
});