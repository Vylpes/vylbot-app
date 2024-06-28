import {APIEmbed, APIEmbedField, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption, TextChannel} from "discord.js";
import Warn from "../../src/commands/warn";
import SettingsHelper from "../../src/helpers/SettingsHelper";
import EmbedColours from "../../src/constants/EmbedColours";
import Audit from "../../src/database/entities/Audit";
import {AuditType} from "../../src/constants/AuditType";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('EXPECT values to be set', () => {
        const command = new Warn();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("warn");
        expect(commandBuilder.description).toBe("Warns a member in the server with an optional reason")
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderUserOption = commandBuilder.options[0] as SlashCommandUserOption;

        expect(commandBuilderUserOption.name).toBe("target");
        expect(commandBuilderUserOption.description).toBe("The user");
        expect(commandBuilderUserOption.required).toBe(true);

        const commandBuilderReasonOption = commandBuilder.options[1] as SlashCommandStringOption;

        expect(commandBuilderReasonOption.name).toBe("reason");
        expect(commandBuilderReasonOption.description).toBe("The reason");
    });
});

describe('Execute', () => {
    test("EXPECT user to be warned", async () => {
        let sentEmbeds: EmbedBuilder[] | undefined;
        let savedAudit: Audit | undefined;

        // Arrange
        const targetUser = {
            user: {
                id: "userId",
                tag: "userTag",
                avatarURL: jest.fn().mockReturnValue("https://google.com/avatar.png"),
            },
            member: {},
        };

        const reason = {
            value: "Test reason",
        };

        const logChannel = {
            send: jest.fn().mockImplementation((opts: any) => {
                sentEmbeds = opts.embeds;
            }),
        } as unknown as TextChannel;

        const interaction = {
            reply: jest.fn(),
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(logChannel),
                    },
                },
            },
            guildId: "guildId",
            user: {
                id: "moderatorId",
            },
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("mod-logs");

        Audit.prototype.Save = jest.fn().mockImplementation((_, audit: Audit) => {
            savedAudit = audit;
        });
        
        // Act
        const command = new Warn();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Successfully warned user.");

        expect(interaction.options.get).toHaveBeenCalledTimes(2);
        expect(interaction.options.get).toHaveBeenCalledWith("target");
        expect(interaction.options.get).toHaveBeenCalledWith("reason");

        expect(interaction.guild!.channels.cache.find).toHaveBeenCalledTimes(1);
        
        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("channels.logs.mod", "guildId");

        expect(targetUser.user.avatarURL).toHaveBeenCalledTimes(1);

        expect(logChannel.send).toHaveBeenCalledTimes(1);

        expect(sentEmbeds).toBeDefined();
        expect(sentEmbeds).toMatchSnapshot();

        expect(Audit.prototype.Save).toHaveBeenCalledWith(Audit, expect.any(Audit));

        expect(savedAudit).toMatchSnapshot({
            Id: expect.any(String),
            AuditId: expect.any(String),
            WhenCreated: expect.any(Date),
            WhenUpdated: expect.any(Date)
        });
    });

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
