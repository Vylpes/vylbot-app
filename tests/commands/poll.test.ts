import { CommandInteraction, EmbedBuilder, InteractionResponse, Message, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import Command from "../../src/commands/poll";
import EmbedColours from "../../src/constants/EmbedColours";

describe('Constructor', () => {
    test('EXPECT properties to be set', () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("poll");
        expect(commandBuilder.description).toBe("Run a poll, automatically adding reaction emojis as options");
        expect(commandBuilder.options.length).toBe(6);

        const commandBuilderTitleOption = commandBuilder.options[0] as SlashCommandStringOption;

        expect(commandBuilderTitleOption.name).toBe("title");
        expect(commandBuilderTitleOption.description).toBe("Title of the poll");
        expect(commandBuilderTitleOption.required).toBe(true);

        const commandBuilderOption1Option = commandBuilder.options[1] as SlashCommandStringOption;

        expect(commandBuilderOption1Option.name).toBe("option1");
        expect(commandBuilderOption1Option.description).toBe("Option 1");
        expect(commandBuilderOption1Option.required).toBe(true);

        const commandBuilderOption2Option = commandBuilder.options[2] as SlashCommandStringOption;

        expect(commandBuilderOption2Option.name).toBe("option2");
        expect(commandBuilderOption2Option.description).toBe("Option 2");
        expect(commandBuilderOption2Option.required).toBe(true);

        const commandBuilderOption3Option = commandBuilder.options[3] as SlashCommandStringOption;

        expect(commandBuilderOption3Option.name).toBe("option3");
        expect(commandBuilderOption3Option.description).toBe("Option 3");

        const commandBuilderOption4Option = commandBuilder.options[4] as SlashCommandStringOption;

        expect(commandBuilderOption4Option.name).toBe("option4");
        expect(commandBuilderOption4Option.description).toBe("Option 4");

        const commandBuilderOption5Option = commandBuilder.options[5] as SlashCommandStringOption;

        expect(commandBuilderOption5Option.name).toBe("option5");
        expect(commandBuilderOption5Option.description).toBe("Option 5");
    });
});

describe('Execute', () => {
    test("EXPECT a poll to be created", async () => {
        let sentEmbed: EmbedBuilder | undefined;

        // Arrange
        const message = {
            react: jest.fn(),
        } as unknown as Message<boolean>;

        const response = {
            fetch: jest.fn().mockResolvedValue(message),
        } as unknown as InteractionResponse<boolean>;

        const interaction = {
            options: {
                get: jest.fn().mockReturnValueOnce({ value: "Title" })
                    .mockReturnValueOnce({ value: "Option 1" })
                    .mockReturnValueOnce({ value: "Option 2" })
                    .mockReturnValueOnce({ value: "Option 3" })
                    .mockReturnValueOnce({ value: "Option 4" })
                    .mockReturnValue({ value: "Option 5" }),
            },
            reply: jest.fn().mockImplementation((options: any) => {
                sentEmbed = options.embeds[0];

                return response;
            }),
            user: {
                username: "username",
                avatarURL: jest.fn().mockReturnValue("https://avatarurl.com/user.png"),
            },
        } as unknown as CommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.get).toHaveBeenCalledTimes(6);
        expect(interaction.options.get).toHaveBeenCalledWith("title", true);
        expect(interaction.options.get).toHaveBeenCalledWith("option1", true);
        expect(interaction.options.get).toHaveBeenCalledWith("option2", true);
        expect(interaction.options.get).toHaveBeenCalledWith("option3");
        expect(interaction.options.get).toHaveBeenCalledWith("option4");
        expect(interaction.options.get).toHaveBeenCalledWith("option5");

        expect(interaction.reply).toHaveBeenCalledTimes(1);

        expect(sentEmbed).toBeDefined();
        expect(sentEmbed!.data.color).toBe(EmbedColours.Ok);
        expect(sentEmbed!.data.title).toBe("Title");
        expect(sentEmbed!.data.description).toBe("1️⃣ Option 1\n2️⃣ Option 2\n3️⃣ Option 3\n4️⃣ Option 4\n5️⃣ Option 5");
        expect(sentEmbed!.data.footer).toBeDefined();
        expect(sentEmbed!.data.footer!.text).toBe("Poll by username");
        expect(sentEmbed!.data.footer!.icon_url).toBe("https://avatarurl.com/user.png");

        expect(interaction.user.avatarURL).toHaveBeenCalledTimes(1);

        expect(response.fetch).toHaveBeenCalledTimes(1);

        expect(message.react).toHaveBeenCalledTimes(5);
        expect(message.react).toHaveBeenCalledWith("1️⃣");
        expect(message.react).toHaveBeenCalledWith("2️⃣");
        expect(message.react).toHaveBeenCalledWith("3️⃣");
        expect(message.react).toHaveBeenCalledWith("4️⃣");
        expect(message.react).toHaveBeenCalledWith("5️⃣");
    });

    test.todo("GIVEN title is not supplied, EXPECT nothing to happen");

    test.todo("GIVEN option1 is not supplied, EXPECT nothing to happen");

    test.todo("GIVEN option2 is not supplied, EXPECT nothing to happen");

    test.todo("GIVEN option3 is not supplied, EXPECT a 2 option poll to be created");

    test.todo("GIVEN option4 is not supplied, EXPECT a 3 option poll to be created");

    test.todo("GIVEN option5 is not supplied, EXPECT a 4 option poll to be created");
});