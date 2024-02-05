import { ButtonInteraction, GuildMember, Role } from "discord.js";
import Verify from "../../src/buttonEvents/verify";
import SettingsHelper from "../../src/helpers/SettingsHelper";

jest.mock("../../src/helpers/SettingsHelper");

describe("execute", () => {
    let role: Role;
    let member: GuildMember;
    let interaction: ButtonInteraction;

    let entity: Verify;

    beforeEach(() => {
        entity = new Verify();

        role = {} as Role;

        member = {
            manageable: true,
            roles: {
                add: jest.fn(),
            }
        } as unknown as GuildMember;

        interaction = {
            reply: jest.fn(),
            guildId: 'guildId',
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue(role),
                    }
                },
                members: {
                    cache: {
                        find: jest.fn().mockReturnValue(member),
                    }
                }
            }
        } as unknown as ButtonInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("roleName");
    });

    test("EXPECT verification role to be given", async () => {
        await entity.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith({
            content: "Given role",
            ephemeral: true,
        });

        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("verification.role", "guildId");

        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(1);
        expect(interaction.guild?.members.cache.find).toHaveBeenCalledTimes(1);

        expect(member.roles.add).toHaveBeenCalledWith(role);
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        interaction.guildId = null;

        await entity.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();
        expect(interaction.guild?.roles.cache.find).not.toHaveBeenCalled();
        expect(interaction.guild?.members.cache.find).not.toHaveBeenCalled();
        expect(member.roles.add).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.guild is null, EXPECT nothing to happen", async () => {
        interaction = {
            reply: jest.fn(),
            guildId: 'guildId',
            guild: null,
        } as unknown as ButtonInteraction;

        await entity.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();
        expect(member.roles.add).not.toHaveBeenCalled();
    });

    test("GIVEN verification.role setting is not found, EXPECT nothing to happen", async () => {
        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);

        await entity.execute(interaction);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("verification.role", "guildId");

        expect(interaction.reply).not.toHaveBeenCalled();
        expect(interaction.guild?.roles.cache.find).not.toHaveBeenCalled();
        expect(interaction.guild?.members.cache.find).not.toHaveBeenCalled();
        expect(member.roles.add).not.toHaveBeenCalled();
    });

    test("GIVEN role can not be found, EXPECT error", async () => {
        interaction.guild!.roles.cache.find = jest.fn().mockReturnValue(undefined);

        await entity.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith({
            content: "Unable to find the role, roleName",
            ephemeral: true,
        });

        expect(interaction.guild?.members.cache.find).not.toHaveBeenCalled();
        expect(member.roles.add).not.toHaveBeenCalled();
    });

    test("GIVEN member can not be found, EXPECT error", async () => {
        interaction.guild!.members.cache.find = jest.fn().mockReturnValue(undefined);

        await entity.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith({
            content: "Unable to give role to user",
            ephemeral: true,
        });
        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(1);
        expect(interaction.guild?.members.cache.find).toHaveBeenCalledTimes(1);

        expect(member.roles.add).not.toHaveBeenCalled();
    });

    test("GIVEN member is not manageable, EXPECT error", async () => {
        member = {
            manageable: false,
            roles: {
                add: jest.fn(),
            }
        } as unknown as GuildMember;

        interaction.guild!.members.cache.find = jest.fn().mockReturnValue(member);

        await entity.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith({
            content: "Unable to give role to user",
            ephemeral: true,
        });
        expect(interaction.guild?.roles.cache.find).toHaveBeenCalledTimes(1);
        expect(interaction.guild?.members.cache.find).toHaveBeenCalledTimes(1);

        expect(member.roles.add).not.toHaveBeenCalled();
    });
});