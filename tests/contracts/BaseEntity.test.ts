import BaseEntity from "../../src/contracts/BaseEntity";
import uuid from "uuid";

jest.mock("uuid", () => {
    return {
        v4: () => "uuidv4",
    };
});

jest.useFakeTimers();

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const systemTime = new Date("2024-06-29T00:00:00.000Z");

        jest.setSystemTime(systemTime);

        // Act
        const entity = new BaseEntity();

        // Assert
        expect(entity.Id).toBe("uuidv4");
        expect(entity.WhenCreated).toStrictEqual(systemTime);
        expect(entity.WhenUpdated).toStrictEqual(systemTime);
    });
});

describe("Save", () => {
    test.todo("EXPECT entity to be saved");
});

describe("Remove", () => {
    test.todo("EXPECT entity to be removed");
});

describe("FetchAll", () => {
    test.todo("EXPECT all entities to be returned");

    test.todo("GIVEN relations parameter is not supplied, EXPECT relations to be defaulted");
});

describe("FetchOneById", () => {
    test.todo("EXPECT one entity to be returned");

    test.todo("GIVEN relations parameter is not supplied, EXPECT relations to be defaulted");
});

describe("Any", () => {
    test.todo("GIVEN at least 1 entity is found, EXPECT true to be returned");

    test.todo("GIVEN no entities are found, EXPECT false to be returned");
});
