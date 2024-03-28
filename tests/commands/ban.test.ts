import { APIEmbedField, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import Ban from "../../src/commands/ban";
import SettingsHelper from "../../src/helpers/SettingsHelper";
import Audit from "../../src/database/entities/Audit";
import EmbedColours from "../../src/constants/EmbedColours";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values to be set', () => {
        const command = new Ban();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("ban");
        expect(commandBuilder.description).toBe("Ban a member from the server with an optional reason");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.BanMembers.toString());
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderTargetOption = commandBuilder.options[0] as SlashCommandUserOption;

        expect(commandBuilderTargetOption.name).toBe("target");
        expect(commandBuilderTargetOption.description).toBe("The user");
        expect(commandBuilderTargetOption.required).toBeTruthy();

        const commandBuilderReasonOption = commandBuilder.options[1] as SlashCommandStringOption;

        expect(commandBuilderReasonOption.name).toBe("reason");
        expect(commandBuilderReasonOption.description).toBe("The reason");
    });
});

describe('Execute', () => {
    test('GIVEN command is valid, EXPECT user to be banned', async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: true,
                ban: jest.fn(),
            },
        };

        const reason = {
            value: "reason",
        };

        const modChannel = {
            send: jest.fn().mockImplementation((option) => {
                sentWith = option;
            }),
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(modChannel),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelName");
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);

        expect(interaction.options.get).toHaveBeenCalledTimes(2);
        expect(interaction.options.get).toHaveBeenCalledWith("target");
        expect(interaction.options.get).toHaveBeenCalledWith("reason");

        expect(interaction.guild?.channels.cache.find).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("`userTag` has been banned.");

        expect(targetUser.member.ban).toHaveBeenCalledTimes(1);
        expect(targetUser.user.avatarURL).toHaveBeenCalledTimes(1);

        expect(modChannel.send).toHaveBeenCalledTimes(1);
        expect(sentWith).toBeDefined();
        expect(sentWith!.embeds).toBeDefined();
        expect(sentWith!.embeds.length).toBe(1);

        const logEmbed = sentWith!.embeds[0] as EmbedBuilder;

        expect(logEmbed.data.color).toBe(EmbedColours.Ok);
        expect(logEmbed.data.title).toBe("Member Banned");
        expect(logEmbed.data.description).toBe("<@userId> `userTag`");
        expect(logEmbed.data.thumbnail).toBeDefined();
        expect(logEmbed.data.thumbnail!.url).toBe("https://avatarurl.com/user.png");
        expect(logEmbed.data.fields).toBeDefined();
        expect(logEmbed.data.fields!.length).toBe(2);

        const logEmbedModeratorField = logEmbed.data.fields![0] as APIEmbedField;

        expect(logEmbedModeratorField.name).toBe("Moderator");
        expect(logEmbedModeratorField.value).toBe("<@moderatorId>");

        const logEmbedReasonField = logEmbed.data.fields![1] as APIEmbedField;

        expect(logEmbedReasonField.name).toBe("Reason");
        expect(logEmbedReasonField.value).toBe("reason");

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("channels.logs.mod", "guildId");
    });

    test("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.guild is null, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN targetUser is null, EXPECT user not found error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {},
            options: {
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("User not found.");
    });

    test("GIVEN targetUser.user is undefined, EXPECT user not found error", async () => {
        const user = {
            user: undefined,
        }

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {},
            options: {
                get: jest.fn().mockReturnValue(user),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("User not found.");
    });

    test("GIVEN targetUser.member is undefined, EXPECT user not found error", async () => {
        const user = {
            user: {},
            member: undefined,
        }

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {},
            options: {
                get: jest.fn().mockReturnValue(user),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("User not found.");
    });

    test("GIVEN reasonInput is null, EXPECT reason to be defaulted", async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: true,
                ban: jest.fn(),
            },
        };

        const modChannel = {
            send: jest.fn().mockImplementation((option) => {
                sentWith = option;
            }),
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(modChannel),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(null),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelName");
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        const logEmbed = sentWith!.embeds[0] as EmbedBuilder;

        const logEmbedReasonField = logEmbed.data.fields![1] as APIEmbedField;

        expect(logEmbedReasonField.name).toBe("Reason");
        expect(logEmbedReasonField.value).toBe("*none*");
    });

    test("GIVEN reasonInput.value is undefined, EXPECT reason to be defaulted", async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: true,
                ban: jest.fn(),
            },
        };

        const modChannel = {
            send: jest.fn().mockImplementation((option) => {
                sentWith = option;
            }),
        };

        const reason = {
            value: undefined,
        }

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(modChannel),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelName");
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        const logEmbed = sentWith!.embeds[0] as EmbedBuilder;

        const logEmbedReasonField = logEmbed.data.fields![1] as APIEmbedField;

        expect(logEmbedReasonField.name).toBe("Reason");
        expect(logEmbedReasonField.value).toBe("*none*");
    });

    test("GIVEN user is not bannable, EXPECT insufficient permissions error", async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: false,
                ban: jest.fn(),
            },
        };

        const reason = {
            value: "reason",
        };

        const modChannel = {
            send: jest.fn().mockImplementation((option) => {
                sentWith = option;
            }),
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(modChannel),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelName");
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        expect(targetUser.member.ban).not.toHaveBeenCalled();

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Insufficient permissions. Please contact a moderator.");
    });

    test("GIVEN channels.log.mod setting is not set, EXPECT command to return", async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: true,
                ban: jest.fn(),
            },
        };

        const reason = {
            value: "reason",
        };

        const modChannel = {
            send: jest.fn().mockImplementation((option) => {
                sentWith = option;
            }),
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(modChannel),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        expect(interaction.guild?.channels.cache.find).not.toHaveBeenCalled();
    });

    test("GIVEN channel can NOT be found, EXPECT logEmbed not to be sent", async () => {
        let sentWith;

        const targetUser = {
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
            member: {
                bannable: true,
                ban: jest.fn(),
            },
        };

        const reason = {
            value: "reason",
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(null),
                    }
                }
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            user: {
                id: "moderatorId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelName");
        Audit.prototype.Save = jest.fn();

        const ban = new Ban();
        await ban.execute(interaction);

        expect(Audit.prototype.Save).toHaveBeenCalled();
    });
});