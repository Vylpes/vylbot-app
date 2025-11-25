import { ButtonInteraction, PermissionsBitField } from "discord.js";
import Bunny from "../../src/buttonEvents/bunny";

describe("GIVEN delete action", () => {
    describe("GIVEN user is the original user", () => {
        let interaction: ButtonInteraction;
        let deleteSpy: jest.Mock;

        beforeEach(async () => {
            deleteSpy = jest.fn();

            interaction = {
                customId: "bunny delete userId123",
                user: {
                    id: "userId123",
                },
                guild: {
                    members: {
                        cache: new Map([
                            ["userId123", {
                                permissions: {
                                    has: jest.fn().mockReturnValue(false),
                                },
                            }],
                        ]),
                    },
                },
                member: {},
                message: {
                    deletable: true,
                    delete: deleteSpy,
                },
                reply: jest.fn(),
            } as unknown as ButtonInteraction;

            const bunny = new Bunny();
            await bunny.execute(interaction);
        });

        test("EXPECT message to be deleted", () => {
            expect(deleteSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("GIVEN user has ManageMessages permission", () => {
        let interaction: ButtonInteraction;
        let deleteSpy: jest.Mock;

        beforeEach(async () => {
            deleteSpy = jest.fn();

            interaction = {
                customId: "bunny delete originalUserId",
                user: {
                    id: "differentUserId",
                },
                guild: {
                    members: {
                        cache: new Map([
                            ["differentUserId", {
                                permissions: {
                                    has: jest.fn().mockReturnValue(true),
                                },
                            }],
                        ]),
                    },
                },
                member: {},
                message: {
                    deletable: true,
                    delete: deleteSpy,
                },
                reply: jest.fn(),
            } as unknown as ButtonInteraction;

            const bunny = new Bunny();
            await bunny.execute(interaction);
        });

        test("EXPECT message to be deleted", () => {
            expect(deleteSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("GIVEN user is neither original user nor has permission", () => {
        let interaction: ButtonInteraction;
        let deleteSpy: jest.Mock;
        let replySpy: jest.Mock;

        beforeEach(async () => {
            deleteSpy = jest.fn();
            replySpy = jest.fn();

            interaction = {
                customId: "bunny delete originalUserId",
                user: {
                    id: "differentUserId",
                },
                guild: {
                    members: {
                        cache: new Map([
                            ["differentUserId", {
                                permissions: {
                                    has: jest.fn().mockReturnValue(false),
                                },
                            }],
                        ]),
                    },
                },
                member: {},
                message: {
                    deletable: true,
                    delete: deleteSpy,
                },
                reply: replySpy,
            } as unknown as ButtonInteraction;

            const bunny = new Bunny();
            await bunny.execute(interaction);
        });

        test("EXPECT permission error message", () => {
            expect(replySpy).toHaveBeenCalledTimes(1);
            expect(replySpy).toHaveBeenCalledWith({
                content: "You do not have permission to delete this message.",
                ephemeral: true,
            });
        });

        test("EXPECT message NOT to be deleted", () => {
            expect(deleteSpy).not.toHaveBeenCalled();
        });
    });

    describe("GIVEN message is not deletable", () => {
        let interaction: ButtonInteraction;
        let deleteSpy: jest.Mock;
        let replySpy: jest.Mock;

        beforeEach(async () => {
            deleteSpy = jest.fn();
            replySpy = jest.fn();

            interaction = {
                customId: "bunny delete userId123",
                user: {
                    id: "userId123",
                },
                guild: {
                    members: {
                        cache: new Map([
                            ["userId123", {
                                permissions: {
                                    has: jest.fn().mockReturnValue(false),
                                },
                            }],
                        ]),
                    },
                },
                member: {},
                message: {
                    deletable: false,
                    delete: deleteSpy,
                },
                reply: replySpy,
            } as unknown as ButtonInteraction;

            const bunny = new Bunny();
            await bunny.execute(interaction);
        });

        test("EXPECT error message", () => {
            expect(replySpy).toHaveBeenCalledTimes(1);
            expect(replySpy).toHaveBeenCalledWith({
                content: "Unable to delete this message.",
                ephemeral: true,
            });
        });

        test("EXPECT message NOT to be deleted", () => {
            expect(deleteSpy).not.toHaveBeenCalled();
        });
    });

    describe("GIVEN interaction is not in a guild", () => {
        let interaction: ButtonInteraction;
        let replySpy: jest.Mock;

        beforeEach(async () => {
            replySpy = jest.fn();

            interaction = {
                customId: "bunny delete userId123",
                user: {
                    id: "userId123",
                },
                guild: null,
                member: null,
                reply: replySpy,
            } as unknown as ButtonInteraction;

            const bunny = new Bunny();
            await bunny.execute(interaction);
        });

        test("EXPECT guild-only error message", () => {
            expect(replySpy).toHaveBeenCalledTimes(1);
            expect(replySpy).toHaveBeenCalledWith({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        });
    });
});
