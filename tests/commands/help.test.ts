import Help, { ICommandData } from "../../src/commands/help";
import { Message } from "discord.js";
import { ICommandContext } from "../../src/contracts/ICommandContext";

const oldCwd = process.cwd();

describe('Constructor', () => {
	test('Expect properties to be set', () => {
		const help = new Help();

		expect(help._category).toBe('General');
	});
});

describe('Execute', () => {
	test('Given no arguments were given, expect SendAll to be executed', () => {
		const message = {} as unknown as Message;

		const context: ICommandContext = {
			name: 'help',
			args: [],
			message: message
		};

		const help = new Help();

		help.SendAll = jest.fn();
		help.SendSingle = jest.fn();

		help.execute(context);
		
		expect(help.SendAll).toBeCalled();
		expect(help.SendSingle).not.toBeCalled();
	});

	test('Given an argument was given, expect SendSingle to be executed', () => {
		const message = {} as unknown as Message;

		const context: ICommandContext = {
			name: 'help',
			args: ['about'],
			message: message
		};

		const help = new Help();

		help.SendAll = jest.fn();
		help.SendSingle = jest.fn();

		help.execute(context);

		expect(help.SendAll).not.toBeCalled();
		expect(help.SendSingle).toBeCalled();
	});
});

describe('SendAll', () => {
	test('Expect embed with all commands to be sent', () => {
		const messageChannelSend = jest.fn();

		const message = {
			channel: {
				send: messageChannelSend
			}
		} as unknown as Message;

		const context: ICommandContext = {
			name: 'help',
			args: [],
			message: message
		};

		const help = new Help();

		const commandData0: ICommandData = {
			Exists: true,
			Name: 'about',
			Category: 'general',
			Roles: []
		};

		const commandData1: ICommandData = {
			Exists: true,
			Name: 'role',
			Category: 'general',
			Roles: []
		};

		help.GetAllCommandData = jest.fn()
			.mockReturnValue([commandData0, commandData1]);

		const result = help.SendAll(context);

		expect(help.GetAllCommandData).toBeCalled();
		expect(messageChannelSend).toBeCalled();

		expect(result.embeds.length).toBe(1);

		// PublicEmbed
		const publicEmbed = result.embeds[0];

		expect(publicEmbed.fields.length).toBe(1);

		// PublicEmbed -> GeneralCategory Field
		const publicEmbedFieldGeneral = publicEmbed.fields[0];

		expect(publicEmbedFieldGeneral.name).toBe('General');
		expect(publicEmbedFieldGeneral.value).toBe('about, role');
	});
});

describe('SendSingle', () => {
	test('Given command exists, expect embed to be sent with command fields', () => {
		const messageChannelSend = jest.fn();

		const message = {
			channel: {
				send: messageChannelSend
			}
		} as unknown as Message;

		const context: ICommandContext = {
			name: 'help',
			args: ['about'],
			message: message
		};

		const commandData: ICommandData = {
			Exists: true,
			Name: 'about',
			Category: 'general',
			Roles: ['role1', 'role2']
		};
		
		const help = new Help();

		help.GetCommandData = jest.fn()
			.mockReturnValue(commandData);

		const result = help.SendSingle(context);

		expect(help.GetCommandData).toBeCalledWith('about');
		expect(messageChannelSend).toBeCalled();
		expect(result.embeds.length).toBe(1);

		// PublicEmbed
		const publicEmbed = result.embeds[0];

		expect(publicEmbed.title).toBe('About');
		expect(publicEmbed.description).toBe('');
		expect(publicEmbed.fields.length).toBe(2);

		// PublicEmbed -> Category Field
		const fieldCategory = publicEmbed.fields[0];

		expect(fieldCategory.name).toBe('Category');
		expect(fieldCategory.value).toBe('General');

		// PublicEmbed -> RequiredRoles Field
		const fieldRoles = publicEmbed.fields[1];

		expect(fieldRoles.name).toBe('Required Roles');
		expect(fieldRoles.value).toBe('Role1, Role2');
	});

	test('Given command does not exist, expect error embed to be sent', () => {
		const messageChannelSend = jest.fn();

		const message = {
			channel: {
				send: messageChannelSend
			}
		} as unknown as Message;

		const context: ICommandContext = {
			name: 'help',
			args: ['about'],
			message: message
		};

		const commandData: ICommandData = {
			Exists: false
		};

		const help = new Help();

		help.GetCommandData = jest.fn()
			.mockReturnValue(commandData);

		const result = help.SendSingle(context);

		expect(help.GetCommandData).toBeCalledWith('about');
		expect(messageChannelSend).toBeCalled();
		expect(result.embeds.length).toBe(1);

		// ErrorEmbed
		const errorEmbed = result.embeds[0];

		expect(errorEmbed.description).toBe('Command does not exist');
	});
});

describe('GetAllCommandData', () => {
	test('Expect array of command data to be returned', () => {
		process.env = {
			FOLDERS_COMMANDS: "commands"
		};

		process.cwd = jest.fn()
			.mockReturnValue(`${oldCwd}/tests/_mocks`);

		const help = new Help();

		const result = help.GetAllCommandData();

		expect(result.length).toBe(1);

		// Mock Command
		const mockCommand = result[0];

		expect(mockCommand.Exists).toBeTruthy();
		expect(mockCommand.Name).toBe("mockCmd");
		expect(mockCommand.Category).toBe("General");

		expect(mockCommand.Roles!.length).toBe(1);
		expect(mockCommand.Roles![0]).toBe("Moderator");
	});
});

describe('GetCommandData', () => {
	test('Given command exists, expect data to be returned', () => {
		process.env = {
			FOLDERS_COMMANDS: "commands"
		};

		process.cwd = jest.fn()
			.mockReturnValue(`${oldCwd}/tests/_mocks`);

		const help = new Help();

		const result = help.GetCommandData('mockCmd');

		expect(result.Exists).toBeTruthy();
		expect(result.Name).toBe("mockCmd");
		expect(result.Category).toBe("General");

		expect(result.Roles!.length).toBe(1);
		expect(result.Roles![0]).toBe("Moderator");
	});

	test('Given command does not exist, expect exists false to be returned', () => {
		process.env = {
			FOLDERS_COMMANDS: "commands"
		};

		const oldCwd = process.cwd();

		process.cwd = jest.fn()
			.mockReturnValue(`${oldCwd}/tests/_mocks`);

		const help = new Help();

		const result = help.GetCommandData('none');

		expect(result.Exists).toBeFalsy();
	});
});
