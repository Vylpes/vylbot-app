import { CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption, TextChannel, User } from "discord.js";
import Command from "../../src/commands/kick";
import SettingsHelper from "../../src/helpers/SettingsHelper";
import Audit from "../../src/database/entities/Audit";
import EmbedColours from "../../src/constants/EmbedColours";
import { AuditType } from "../../src/constants/AuditType";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('EXPECT properties to be set', () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("kick");
        expect(commandBuilder.description).toBe("Kick a member from the server with an optional reason");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.KickMembers.toString());
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderTargetOption = commandBuilder.options[0] as SlashCommandUserOption;

        expect(commandBuilderTargetOption.name).toBe("target");
        expect(commandBuilderTargetOption.description).toBe("The user");
        expect(commandBuilderTargetOption.required).toBe(true);

        const commandBuilderReasonOption = commandBuilder.options[1] as SlashCommandStringOption;

        expect(commandBuilderReasonOption.name).toBe("reason");
        expect(commandBuilderReasonOption.description).toBe("The reason");
    });
});

describe('Execute', () => {
    test("GIVEN input is valid, EXPECT member to be kicked", async () => {
        let sentEmbed: EmbedBuilder | undefined;
        let savedAudit: Audit | undefined;

        // Arrange
        const targetUser = {
            member: {
                kickable: true,
                kick: jest.fn(),
            } as unknown as GuildMember,
            user: {
                tag: "userTag",
                id: "userId",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            } as unknown as User,
        };

        const reason = {
            value: "Test reason",
        };

        const channel = {
            name: "mod-logs",
            send: jest.fn().mockImplementation((options: any) => {
                sentEmbed = options.embeds[0];
            }),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            guild: {
                channels: {
                    cache: [ channel ],
                },
            },
            options: {
                get: jest.fn().mockReturnValueOnce(targetUser)
                    .mockReturnValue(reason),
            },
            reply: jest.fn(),
            user: {
                id: "moderatorId",
            },
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("mod-logs");

        Audit.prototype.Save = jest.fn().mockImplementation((_, audit: Audit) => {
            savedAudit = audit;
        });

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);

        expect(interaction.options.get).toHaveBeenCalledTimes(2);
        expect(interaction.options.get).toHaveBeenCalledWith("target", true);
        expect(interaction.options.get).toHaveBeenCalledWith("reason");

        expect(targetUser.member.kick).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("`userTag` has been kicked.");

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("channels.logs.mod", "guildId");

        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send).toHaveBeenCalledWith({ embeds: [ expect.any(EmbedBuilder) ] });

        expect(Audit.prototype.Save).toHaveBeenCalledTimes(1);
        expect(Audit.prototype.Save).toHaveBeenCalledWith(Audit, expect.any(Audit));

        expect(sentEmbed).toBeDefined();
        expect(sentEmbed!.data.color).toBe(EmbedColours.Ok);
        expect(sentEmbed!.data.title).toBe("Member Kicked");
        expect(sentEmbed!.data.description).toBe("<@userId> `userTag`");
        expect(sentEmbed!.data.thumbnail?.url).toBe("https://avatarurl.com/user.png");
        expect(sentEmbed!.data.fields).toBeDefined();
        expect(sentEmbed!.data.fields!.length).toBe(2);

        const sentEmbedModeratorField = sentEmbed!.data.fields![0];

        expect(sentEmbedModeratorField.name).toBe("Moderator");
        expect(sentEmbedModeratorField.value).toBe("<@moderatorId>");

        const sentEmbedReasonField = sentEmbed!.data.fields![1];

        expect(sentEmbedReasonField.name).toBe("Reason");
        expect(sentEmbedReasonField.value).toBe("Test reason");

        expect(targetUser.user.avatarURL).toHaveBeenCalledTimes(1);

        expect(savedAudit).toBeDefined();
        expect(savedAudit?.UserId).toBe("userId");
        expect(savedAudit?.AuditType).toBe(AuditType.Kick);
        expect(savedAudit?.Reason).toBe("Test reason");
        expect(savedAudit?.ModeratorId).toBe("moderatorId");
        expect(savedAudit?.ServerId).toBe("guildId");
    });

    test.todo("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN interaction.guild is null, EXPECT nothing to happen");

    test.todo("GIVEN reasonInput is null, EXPECT reason to be defaulted");

    test.todo("GIVEN reasonInput.value is undefined, EXPECT reason to be defaulted");

    test.todo("GIVEN user is not kickable, EXPECT insufficient permissions error");

    test.todo("GIVEN channels.logs.mod setting can not be found, EXPECT command to return");

    test.todo("GIVEN channel can not be found, EXPECT logEmbed not to be sent");
});