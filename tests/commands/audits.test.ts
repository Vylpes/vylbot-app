import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "discord.js";
import Audits from "../../src/commands/audits";
import Audit from "../../src/database/entities/Audit";
import { AuditType } from "../../src/constants/AuditType";
import AuditTools from "../../src/helpers/AuditTools";
import EmbedColours from "../../src/constants/EmbedColours";
import StringTools from "../../src/helpers/StringTools";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const audits = new Audits();

        expect(audits.CommandBuilder).toBeDefined();

        const commandBuilder = audits.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("audits");
        expect(commandBuilder.description).toBe("View audits of a particular user in the server");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());
        expect(commandBuilder.options.length).toBe(4);

        const userSubcommand = commandBuilder.options[0] as SlashCommandSubcommandBuilder;

        expect(userSubcommand.name).toBe("user");
        expect(userSubcommand.description).toBe("View all audits done against a user");
        expect(userSubcommand.options.length).toBe(1);

        const userSubcommandUserOption = userSubcommand.options[0] as SlashCommandUserOption;

        expect(userSubcommandUserOption.name).toBe("target");
        expect(userSubcommandUserOption.description).toBe("The user");
        expect(userSubcommandUserOption.required).toBe(true);

        const viewSubcommand = commandBuilder.options[1] as SlashCommandSubcommandBuilder;

        expect(viewSubcommand.name).toBe("view");
        expect(viewSubcommand.description).toBe("View a particular audit");
        expect(viewSubcommand.options.length).toBe(1);

        const viewSubcommandAuditIdOption = viewSubcommand.options[0] as SlashCommandStringOption;

        expect(viewSubcommandAuditIdOption.name).toBe("auditid");
        expect(viewSubcommandAuditIdOption.description).toBe("The audit id in caps");
        expect(viewSubcommandAuditIdOption.required).toBe(true);

        const clearSubcommand = commandBuilder.options[2] as SlashCommandSubcommandBuilder;

        expect(clearSubcommand.name).toBe("clear");
        expect(clearSubcommand.description).toBe("Clears an audit from a user");
        expect(clearSubcommand.options.length).toBe(1);

        const clearSubcommandAuditIdOption = clearSubcommand.options[0] as SlashCommandStringOption;

        expect(clearSubcommandAuditIdOption.name).toBe("auditid");
        expect(clearSubcommandAuditIdOption.description).toBe("The audit id in caps");
        expect(clearSubcommandAuditIdOption.required).toBe(true);

        const addSubcommand = commandBuilder.options[3] as SlashCommandSubcommandBuilder;

        expect(addSubcommand.name).toBe("add");
        expect(addSubcommand.description).toBe("Manually add an audit");
        expect(addSubcommand.options.length).toBe(3);   

        const addSubcommandUserOption = addSubcommand.options[0] as SlashCommandUserOption;

        expect(addSubcommandUserOption.name).toBe("target");
        expect(addSubcommandUserOption.description).toBe("The user");
        expect(addSubcommandUserOption.required).toBe(true);

        const addSubcommandTypeOption = addSubcommand.options[1] as SlashCommandStringOption;

        expect(addSubcommandTypeOption.name).toBe("type");
        expect(addSubcommandTypeOption.description).toBe("The type of audit");
        expect(addSubcommandTypeOption.required).toBe(true);
        expect(addSubcommandTypeOption.choices).toBeDefined();
        expect(addSubcommandTypeOption.choices!.length).toBe(5);

        const addSubcommandReasonOption = addSubcommand.options[2] as SlashCommandStringOption;

        expect(addSubcommandReasonOption.name).toBe("reason");
        expect(addSubcommandReasonOption.description).toBe("The reason");
    });
});

describe('execute', () => {
    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN subcommand is invalid, EXPECT error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("invalid"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Subcommand doesn't exist.");
    });
});

describe("user", () => {
    test("EXPECT audits for user to be sent", async () => {
        let repliedWith;

        const user = {
            id: "userId",
        };
        const audit = {
            AuditId: "auditId",
            AuditType: AuditType.Warn,
            WhenCreated: new Date(5 * 60 * 1000),
        };

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("user"),
                getUser: jest.fn().mockReturnValue(user),
            },
            guildId: "guildId",
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            })
        } as unknown as CommandInteraction;

        Audit.FetchAuditsByUserId = jest.fn().mockReturnValue([ audit ]);
        AuditTools.TypeToFriendlyText = jest.fn().mockReturnValue("Warn");

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditsByUserId).toHaveBeenCalledTimes(1);
        expect(Audit.FetchAuditsByUserId).toHaveBeenCalledWith("userId", "guildId");

        expect(AuditTools.TypeToFriendlyText).toHaveBeenCalledTimes(1);
        expect(AuditTools.TypeToFriendlyText).toHaveBeenCalledWith(AuditType.Warn);

        expect(interaction.options.getUser).toHaveBeenCalledTimes(1);
        expect(interaction.options.getUser).toHaveBeenCalledWith("target");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(repliedWith).toBeDefined();
        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds.length).toBe(1);

        const embed = repliedWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("Audits");
        expect(embed.data.description).toBe("Audits: 1");
        expect(embed.data.fields).toBeDefined();
        expect(embed.data.fields?.length).toBe(1);
        
        const embedField = embed.data.fields![0];
        
        expect(embedField.name).toBe("auditId // Warn");
        expect(embedField.value).toBe(new Date(5 * 60 * 1000).toString());
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("user"),
            },
            guildId: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN user is null, EXPECT error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("user"),
                getUser: jest.fn().mockReturnValue(null),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.options.getUser).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("User not found.");
    });

    test("GIVEN audits null, EXPECT no audits to be displayed", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("user"),
                getUser: jest.fn().mockReturnValue({}),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.FetchAuditsByUserId = jest.fn().mockResolvedValue(null);

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditsByUserId).toHaveBeenCalledTimes(1);

        expect(interaction.options.getUser).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("There are no audits for this user.");
    });

    test("GIVEN audits length is 0, EXPECT no audits to be displayed", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("user"),
                getUser: jest.fn().mockReturnValue({}),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.FetchAuditsByUserId = jest.fn().mockResolvedValue([]);

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditsByUserId).toHaveBeenCalledTimes(1);

        expect(interaction.options.getUser).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("There are no audits for this user.");
    });
});

describe("view", () => {
    test("EXPECT specific audit defaults to be sent", async () => {
        let repliedWith;

        const auditOption = {
            value: "auditId",
        };

        const audit = {
            Reason: "Test reason",
            AuditType: AuditType.Warn,
            ModeratorId: "moderatorId",
            AuditId: "auditId",
        };

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
                get: jest.fn().mockReturnValue(auditOption),
            },
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            }),
        } as unknown as CommandInteraction;

        Audit.FetchAuditByAuditId = jest.fn().mockResolvedValue(audit);
        AuditTools.TypeToFriendlyText = jest.fn().mockReturnValue("Warn");

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledTimes(1);
        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledWith("AUDITID", "guildId");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(repliedWith).toBeDefined();
        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds.length).toBe(1);

        const embed = repliedWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("Audit");
        expect(embed.data.description).toBe("AUDITID");
        expect(embed.data.fields).toBeDefined();
        expect(embed.data.fields!.length).toBe(3);

        const embedReasonField = embed.data.fields![0];

        expect(embedReasonField.name).toBe("Reason");
        expect(embedReasonField.value).toBe("Test reason");
        expect(embedReasonField.inline).toBe(true);

        const embedTypeField = embed.data.fields![1];

        expect(embedTypeField.name).toBe("Type");
        expect(embedTypeField.value).toBe("Warn");
        expect(embedTypeField.inline).toBe(true);

        const embedModeratorField = embed.data.fields![2];

        expect(embedModeratorField.name).toBe("Moderator");
        expect(embedModeratorField.value).toBe("<@moderatorId>");
        expect(embedModeratorField.inline).toBe(true);
    });

    test("GIVEN interaction.guildId is null, expect nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
            },
            guildId: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN auditId is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("auditid");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("AuditId not found.");
    });

    test("GIVEN auditId.value is undefined, EXPECT error", async () => {
        const audit = {
            value: undefined,
        }

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
                get: jest.fn().mockReturnValue(audit),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("auditid");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("AuditId not found.");
    });

    test("GIVEN audit is not in database, EXPECT error", async () => {
        const audit = {
            value: "auditId",
        }

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
                get: jest.fn().mockReturnValue(audit),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.FetchAuditByAuditId = jest.fn().mockResolvedValue(null);

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledTimes(1);

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("auditid");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Audit not found.");
    });

    test("GIVEN audit.Reason was not supplied, EXPECT reason to be defaulted", async () => {
        let repliedWith;

        const auditOption = {
            value: "auditId",
        };

        const audit = {
            Reason: undefined,
            AuditType: AuditType.Warn,
            ModeratorId: "moderatorId",
            AuditId: "auditId",
        };

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("view"),
                get: jest.fn().mockReturnValue(auditOption),
            },
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            }),
        } as unknown as CommandInteraction;

        Audit.FetchAuditByAuditId = jest.fn().mockResolvedValue(audit);
        AuditTools.TypeToFriendlyText = jest.fn().mockReturnValue("Warn");

        const audits = new Audits();
        await audits.execute(interaction);

        const embed = repliedWith!.embeds[0] as EmbedBuilder;

        const embedReasonField = embed.data.fields![0];

        expect(embedReasonField.name).toBe("Reason");
        expect(embedReasonField.value).toBe("*none*");
        expect(embedReasonField.inline).toBe(true);
    });
});

describe("clear", () => {
    test("EXPECT audit to be cleared", async () => {
        const auditOption = {
            value: "auditId",
        }

        const audit = {};

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("clear"),
                get: jest.fn().mockReturnValue(auditOption),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.FetchAuditByAuditId = jest.fn().mockReturnValue(audit);
        Audit.Remove = jest.fn();

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledTimes(1);
        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledWith("AUDITID", "guildId");

        expect(Audit.Remove).toHaveBeenCalledTimes(1);

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("auditid");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Audit cleared.");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("clear"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);
        
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN auditId is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("clear"),
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);
        
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("AuditId not found.");
    });

    test("GIVEN auditId.value is undefined, EXPECT error", async () => {
        const auditOption = {
            value: undefined,
        }

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("clear"),
                get: jest.fn().mockReturnValue(auditOption),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);
        
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("AuditId not found.");
    });

    test("GIVEN audit is not found, EXPECT error", async () => {
        const auditOption = {
            value: "auditId",
        }

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("clear"),
                get: jest.fn().mockReturnValue(auditOption),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.FetchAuditByAuditId = jest.fn().mockReturnValue(null);

        const audits = new Audits();
        await audits.execute(interaction);
        
        expect(Audit.FetchAuditByAuditId).toHaveBeenCalledTimes(1);
        
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Audit not found.");
    });
});

describe("add", () => {
    test("EXPECT audit to be added", async () => {
        const user = {
            id: "userId",
        };

        const type = {
            value: AuditType.Warn,
        };

        const reason = {};

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(user),
                get: jest.fn().mockReturnValueOnce(type)
                    .mockReturnValue(reason),
            },
            user: {
                id: "userId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.prototype.Save = jest.fn();
        StringTools.RandomString = jest.fn().mockReturnValue("AUDITID");

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.prototype.Save).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Created new audit with ID `AUDITID`");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            guildId: null,
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN user is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(null),
                get: jest.fn().mockReturnValue({}),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Invalid input.");
    });

    test("GIVEN auditType is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(null),
                get: jest.fn().mockReturnValueOnce(null)
                    .mockReturnValue({}),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Invalid input.");
    });

    test("GIVEN auditType.value is undefined, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(null),
                get: jest.fn().mockReturnValueOnce({
                    value: undefined
                })
                    .mockReturnValue({}),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const audits = new Audits();
        await audits.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Invalid input.");
    });

    test("GIVEN reasonInput is null, EXPECT reason to be empty", async ()=> {
        let savedAudit: Audit | undefined;

        const user = {
            id: "userId",
        };

        const type = {
            value: AuditType.Warn,
        };

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(user),
                get: jest.fn().mockReturnValueOnce(type)
                    .mockReturnValue(null),
            },
            user: {
                id: "userId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.prototype.Save = jest.fn().mockImplementation((_, audit: Audit) => {
            savedAudit = audit;
        });
        StringTools.RandomString = jest.fn().mockReturnValue("AUDITID");

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.prototype.Save).toHaveBeenCalledTimes(1);

        expect(savedAudit).toBeDefined();
        expect(savedAudit!.Reason).toBe("");
    });

    test("GIVEN reasonType.value is undefined, EXPECT reason to be empty", async () => {
        let savedAudit: Audit | undefined;

        const user = {
            id: "userId",
        };

        const type = {
            value: AuditType.Warn,
        };

        const reason = {
            value: undefined,
        };

        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                getUser: jest.fn().mockReturnValue(user),
                get: jest.fn().mockReturnValueOnce(type)
                    .mockReturnValue(reason),
            },
            user: {
                id: "userId",
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Audit.prototype.Save = jest.fn().mockImplementation((_, audit: Audit) => {
            savedAudit = audit;
        });
        StringTools.RandomString = jest.fn().mockReturnValue("AUDITID");

        const audits = new Audits();
        await audits.execute(interaction);

        expect(Audit.prototype.Save).toHaveBeenCalledTimes(1);

        expect(savedAudit).toBeDefined();
        expect(savedAudit!.Reason).toBe("");
    });
});