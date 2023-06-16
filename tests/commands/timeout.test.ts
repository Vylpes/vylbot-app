import { APIEmbed, CacheType, CommandInteraction, CommandInteractionOption, DMChannel, Embed, EmbedBuilder, EmbedField, Guild, GuildChannel, GuildMember, InteractionReplyOptions, JSONEncodable, Message, MessageCreateOptions, MessagePayload, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { mock } from "jest-mock-extended";
import Timeout from "../../src/commands/timeout";
import SettingsHelper from "../../src/helpers/SettingsHelper";
import Audit from "../../src/database/entities/Audit";
import EmbedColours from "../../src/constants/EmbedColours";
import { DeepPartial, EntityTarget } from "typeorm";
import BaseEntity from "../../src/contracts/BaseEntity";
import { AuditType } from "../../src/constants/AuditType";

describe('Constructor', () => {
    test('EXPECT CommandBuilder to be configured', () => {
        const command = new Timeout();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("timeout");
        expect(commandBuilder.description).toBe("Timeouts a user out, sending them a DM with the reason if possible");
        expect(commandBuilder.options.length).toBe(3);
    });
});

describe('execute', () => {
    // Happy flow
    test('GIVEN all checks have passed, EXPECT user to be timed out', async () => {
        let embeds: APIEmbed[] | undefined;

        const command = new Timeout();

        const interactionReply = jest.fn((options: InteractionReplyOptions) => {
            embeds = options.embeds as APIEmbed[];
        });

        let savedAudit: DeepPartial<Audit> | undefined;

        const getSetting = jest.spyOn(SettingsHelper, 'GetSetting').mockResolvedValue('mod-logs');
        const auditSave = jest.spyOn(Audit.prototype, 'Save').mockImplementation((target: EntityTarget<BaseEntity>, entity: DeepPartial<BaseEntity>): Promise<void> => {
            savedAudit = entity;

            return Promise.resolve();
        });

        const timeoutFunc = jest.fn();

        let dmChannelSentEmbeds: (APIEmbed | JSONEncodable<APIEmbed>)[] | undefined;
        let logsChannelSentEmbeds: (APIEmbed | JSONEncodable<APIEmbed>)[] | undefined;

        const dmChannel = {
            send: jest.fn().mockImplementation((options: MessageCreateOptions) => {
                dmChannelSentEmbeds = options.embeds;
            }),
        } as unknown as DMChannel;

        const userInput = {
            user: {
                id: 'userId',
                tag: 'userTag',
                createDM: jest.fn().mockResolvedValue(dmChannel),
            } as unknown as User,
            member: {
                manageable: true,
                timeout: timeoutFunc,
            } as unknown as GuildMember,
        } as CommandInteractionOption;

        const lengthInput = {
            value: '1s',
        } as CommandInteractionOption;

        const reasonInput = {
            value: 'Test reason',
        } as CommandInteractionOption;

        const logsChannel = {
            name: 'mod-logs',
            send: jest.fn().mockImplementation((options: MessageCreateOptions) => {
                logsChannelSentEmbeds = options.embeds;
            }),
        } as unknown as TextChannel;

        const interaction = {
            guild: {
                channels: {
                    cache: {
                        find: jest.fn()
                            .mockReturnValue(logsChannel),
                    }
                },
                name: "Test Guild",
            } as unknown as Guild,
            guildId: 'guildId',
            reply: interactionReply,
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(userInput)
                    .mockReturnValueOnce(lengthInput)
                    .mockReturnValue(reasonInput),
            },
            user: {
                id: 'moderatorId'
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        // EXPECT user to be timed out
        expect(timeoutFunc).toBeCalledWith(1000, 'Test reason');

        // EXPECT embeds to be sent
        expect(embeds).toBeDefined();
        expect(embeds!.length).toBe(1);

        // EXPECT resultEmbed to be correctly configured
        const resultEmbed = embeds![0] as EmbedBuilder;

        expect(resultEmbed.data.description).toBe('<@userId> has been timed out');
        expect(resultEmbed.data.fields).toBeDefined();
        expect(resultEmbed.data.fields!.length).toBe(1);

        // EXPECT DM field to be configured
        const resultEmbedDMField = resultEmbed.data.fields![0];

        expect(resultEmbedDMField.name).toBe("DM Sent");
        expect(resultEmbedDMField.value).toBe("true");

        // EXPECT user to be DM's with embed
        expect(dmChannel.send).toBeCalled();
        expect(dmChannelSentEmbeds).toBeDefined();
        expect(dmChannelSentEmbeds?.length).toBe(1);

        const dmChannelSentEmbed = (dmChannelSentEmbeds![0] as any).data;

        expect(dmChannelSentEmbed.color).toBe(EmbedColours.Ok);
        expect(dmChannelSentEmbed.description).toBe("You have been timed out in Test Guild");
        expect(dmChannelSentEmbed.fields?.length).toBe(3);

        expect(dmChannelSentEmbed.fields![0].name).toBe("Reason");
        expect(dmChannelSentEmbed.fields![0].value).toBe("Test reason");

        expect(dmChannelSentEmbed.fields![1].name).toBe("Length");
        expect(dmChannelSentEmbed.fields![1].value).toBe("1s");

        expect(dmChannelSentEmbed.fields![2].name).toBe("Until");
        expect(dmChannelSentEmbed.fields![2].value).toBeDefined();

        // EXPECT log embed to be sent
        expect(logsChannel.send).toBeCalled();
        expect(logsChannelSentEmbeds).toBeDefined();
        expect(logsChannelSentEmbeds?.length).toBe(1);

        const logsChannelSentEmbed = (logsChannelSentEmbeds![0] as any).data;

        expect(logsChannelSentEmbed.color).toBe(EmbedColours.Ok);
        expect(logsChannelSentEmbed.title).toBe("Member Timed Out");
        expect(logsChannelSentEmbed.description).toBe("<@userId> `userTag`");
        expect(logsChannelSentEmbed.fields?.length).toBe(4);

        expect(logsChannelSentEmbed.fields![0].name).toBe("Moderator");
        expect(logsChannelSentEmbed.fields![0].value).toBe("<@moderatorId>");

        expect(logsChannelSentEmbed.fields![1].name).toBe("Reason");
        expect(logsChannelSentEmbed.fields![1].value).toBe("Test reason");

        expect(logsChannelSentEmbed.fields![2].name).toBe("Length");
        expect(logsChannelSentEmbed.fields![2].value).toBe("1s");

        expect(logsChannelSentEmbed.fields![3].name).toBe("Until");
        expect(logsChannelSentEmbed.fields![3].value).toBeDefined();

        // EXPECT Audit to be saved
        expect(auditSave).toBeCalled();

        expect(savedAudit).toBeDefined();
        expect(savedAudit?.UserId).toBe('userId');
        expect(savedAudit?.AuditType).toBe(AuditType.Timeout);
        expect(savedAudit?.Reason).toBe("Test reason");
        expect(savedAudit?.ModeratorId).toBe('moderatorId');
        expect(savedAudit?.ServerId).toBe('guildId');
    });

    // Null checks
    test('GIVEN interaction.guild IS NULL, EXPECT nothing to happen', async () => {
        const command = new Timeout();

        const interaction = {
            guild: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).not.toBeCalled();
    });

    test('GIVEN interaction.guildId IS NULL, EXPECT nothing to happen', async () => {
        const command = new Timeout();

        const interaction = {
            guild: mock<Guild>(),
            guildId: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).not.toBeCalled();
    });

    // Validation
    test('GIVEN targetUser IS NULL, EXPECT validation error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            options: {
                get: jest.fn().mockReturnValue(undefined),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Fields are required.');
    });

    test('GIVEN targetUser.user IS NULL, EXPECT validation error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {} as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m',
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Fields are required.');
    });

    test('GIVEN targetUser.member IS NULL, EXPECT validation error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {} as User,
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m',
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Fields are required.');
    });

    test('GIVEN lengthInput IS NULL, EXPECT validation error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {} as User,
                                member: {} as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return null;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Fields are required.');
    });

    test('GIVEN lengthInput.value IS NULL, EXPECT validation error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {} as User,
                                member: {} as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: undefined,
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Fields are required.');
    });

    test('GIVEN targetMember IS NOT manageable by the bot, EXPECT insufficient permissions error', async () => {
        const command = new Timeout();

        const interaction = {
            reply: jest.fn(),
            guild: mock<Guild>(),
            guildId: 'guildId',
            user: {
                id: 'moderatorId',
            },
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {
                                    id: 'userId',
                                    tag: 'userTag',
                                } as User,
                                member: {
                                    manageable: false,
                                } as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m',
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        expect(interaction.reply).toBeCalledWith('Insufficient bot permissions. Please contact a moderator.');
    });

    // Reason variable
    test('GIVEN reason IS NULL, EXPECT to be ran with empty string', async () => {
        const command = new Timeout();

        let savedAudit: DeepPartial<Audit> | undefined;

        const auditSave = jest.spyOn(Audit.prototype, 'Save').mockImplementation((target: EntityTarget<BaseEntity>, entity: DeepPartial<BaseEntity>): Promise<void> => {
            savedAudit = entity;

            return Promise.resolve();
        });

        const timeoutFunc = jest.fn();

        const sentEmbeds: EmbedBuilder[] = [];

        const interaction = {
            reply: jest.fn(),
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(mock<TextChannel>()),
                    }
                }
            },
            guildId: 'guildId',
            user: {
                id: 'moderatorId',
            },
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {
                                    id: 'userId',
                                    tag: 'userTag',
                                    createDM: jest.fn().mockReturnValue({
                                        send: jest.fn(async (options: MessageCreateOptions): Promise<Message<false>> => {
                                            sentEmbeds.push(options.embeds![0] as EmbedBuilder);

                                            return mock<Message<false>>();
                                        })
                                    }) as unknown as DMChannel,
                                } as unknown as User,
                                member: {
                                    manageable: true,
                                    timeout: timeoutFunc,
                                } as unknown as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m'
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: undefined,
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;


        await command.execute(interaction);

        expect(timeoutFunc).toBeCalledWith(1000 * 60 * 1, "");
        expect(savedAudit?.Reason).toBe("*none*");

        const dmEmbed = (sentEmbeds[0] as any).data;
        const dmEmbedReasonField = dmEmbed.fields![0] as EmbedField;

        expect(dmEmbedReasonField.value).toBe("*none*");
    });

    // Log embed
    test('GIVEN channelName IS NULL, EXPECT execution to return', async () => {
        const command = new Timeout();

        let savedAudit: DeepPartial<Audit> | undefined;

        const auditSave = jest.spyOn(Audit.prototype, 'Save').mockImplementation((target: EntityTarget<BaseEntity>, entity: DeepPartial<BaseEntity>): Promise<void> => {
            savedAudit = entity;

            return Promise.resolve();
        });

        const settingsGet = jest.spyOn(SettingsHelper, 'GetSetting').mockResolvedValue(undefined);

        const timeoutFunc = jest.fn();

        const sentEmbeds: EmbedBuilder[] = [];

        const logChannelSendFunc = jest.fn();

        const interaction = {
            reply: jest.fn(),
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            send: logChannelSendFunc,
                        } as unknown as TextChannel),
                    }
                }
            },
            guildId: 'guildId',
            user: {
                id: 'moderatorId',
            },
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {
                                    id: 'userId',
                                    tag: 'userTag',
                                    createDM: jest.fn().mockReturnValue({
                                        send: jest.fn(async (options: MessageCreateOptions): Promise<Message<false>> => {
                                            sentEmbeds.push(options.embeds![0] as EmbedBuilder);

                                            return mock<Message<false>>();
                                        })
                                    }) as unknown as DMChannel,
                                } as unknown as User,
                                member: {
                                    manageable: true,
                                    timeout: timeoutFunc,
                                } as unknown as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m'
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;


        await command.execute(interaction);

        expect(timeoutFunc).toBeCalled();
        expect(sentEmbeds.length).toBe(0);
        expect(logChannelSendFunc).not.toBeCalled();
    });

    test('GIVEN channel IS NULL, EXPECT embed to not be sent', async () => {
        const command = new Timeout();

        let savedAudit: DeepPartial<Audit> | undefined;

        const auditSave = jest.spyOn(Audit.prototype, 'Save').mockImplementation((target: EntityTarget<BaseEntity>, entity: DeepPartial<BaseEntity>): Promise<void> => {
            savedAudit = entity;

            return Promise.resolve();
        });

        const settingsGet = jest.spyOn(SettingsHelper, 'GetSetting').mockResolvedValue('mod-logs');

        const timeoutFunc = jest.fn();

        const sentEmbeds: EmbedBuilder[] = [];

        const interaction = {
            reply: jest.fn(),
            guild: {
                channels: {
                    cache: {
                        find: jest.fn().mockReturnValue(undefined),
                    }
                }
            },
            guildId: 'guildId',
            user: {
                id: 'moderatorId',
            },
            options: {
                get: jest.fn((value: string): CommandInteractionOption<CacheType> | null => {
                    switch (value) {
                        case 'target':
                            return {
                                user: {
                                    id: 'userId',
                                    tag: 'userTag',
                                    createDM: jest.fn().mockReturnValue({
                                        send: jest.fn(async (options: MessageCreateOptions): Promise<Message<false>> => {
                                            sentEmbeds.push(options.embeds![0] as EmbedBuilder);

                                            return mock<Message<false>>();
                                        })
                                    }) as unknown as DMChannel,
                                } as unknown as User,
                                member: {
                                    manageable: true,
                                    timeout: timeoutFunc,
                                } as unknown as GuildMember
                            } as CommandInteractionOption;
                        case 'length':
                            return {
                                value: '1m'
                            } as CommandInteractionOption;
                        case 'reason':
                            return {
                                value: 'Test reason',
                            } as CommandInteractionOption;
                        default:
                            return null;
                    }
                }),
            }
        } as unknown as CommandInteraction;


        await command.execute(interaction);

        expect(timeoutFunc).toBeCalled();
        expect(sentEmbeds.length).toBeGreaterThan(0);
    });

    // DM user
    test('GIVEN user can NOT be messaged, EXPECT resultEmbed to contain "DM Sent = false"', async () => {
        let embeds: APIEmbed[] | undefined;

        const command = new Timeout();

        const interactionReply = jest.fn((options: InteractionReplyOptions) => {
            embeds = options.embeds as APIEmbed[];
        });

        let savedAudit: DeepPartial<Audit> | undefined;

        const getSetting = jest.spyOn(SettingsHelper, 'GetSetting').mockResolvedValue('mod-logs');
        const auditSave = jest.spyOn(Audit.prototype, 'Save').mockImplementation((target: EntityTarget<BaseEntity>, entity: DeepPartial<BaseEntity>): Promise<void> => {
            savedAudit = entity;

            return Promise.resolve();
        });

        const timeoutFunc = jest.fn();

        let dmChannelSentEmbeds: (APIEmbed | JSONEncodable<APIEmbed>)[] | undefined;
        let logsChannelSentEmbeds: (APIEmbed | JSONEncodable<APIEmbed>)[] | undefined;

        const dmChannel = {
            send: jest.fn().mockImplementation((options: MessageCreateOptions) => {
                dmChannelSentEmbeds = options.embeds;
            }),
        } as unknown as DMChannel;

        const userInput = {
            user: {
                id: 'userId',
                tag: 'userTag',
                createDM: jest.fn().mockRejectedValue(undefined),
            } as unknown as User,
            member: {
                manageable: true,
                timeout: timeoutFunc,
            } as unknown as GuildMember,
        } as CommandInteractionOption;

        const lengthInput = {
            value: '1s',
        } as CommandInteractionOption;

        const reasonInput = {
            value: 'Test reason',
        } as CommandInteractionOption;

        const logsChannel = {
            name: 'mod-logs',
            send: jest.fn().mockImplementation((options: MessageCreateOptions) => {
                logsChannelSentEmbeds = options.embeds;
            }),
        } as unknown as TextChannel;

        const interaction = {
            guild: {
                channels: {
                    cache: {
                        find: jest.fn()
                            .mockReturnValue(logsChannel),
                    }
                },
                name: "Test Guild",
            } as unknown as Guild,
            guildId: 'guildId',
            reply: interactionReply,
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(userInput)
                    .mockReturnValueOnce(lengthInput)
                    .mockReturnValue(reasonInput),
            },
            user: {
                id: 'moderatorId'
            }
        } as unknown as CommandInteraction;

        await command.execute(interaction);

        // EXPECT embeds to be sent
        expect(embeds).toBeDefined();
        expect(embeds!.length).toBe(1);

        const resultEmbed = embeds![0] as EmbedBuilder;

        // EXPECT DM field to be configured
        const resultEmbedDMField = resultEmbed.data.fields![0];

        expect(resultEmbedDMField.name).toBe("DM Sent");
        expect(resultEmbedDMField.value).toBe("false");
    });
});