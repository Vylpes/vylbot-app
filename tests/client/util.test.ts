import { Util } from "../../src/client/util";

import { Client, Message } from "discord.js";
import fs from "fs";
import { mock } from "jest-mock-extended";
import { Command } from "../../src/type/command";
import ICommandItem from "../../src/contracts/ICommandItem";
import IEventItem from "../../src/contracts/IEventItem";
import { Event } from "../../src/type/event";

jest.mock("fs");

beforeEach(() => {
  fs.existsSync = jest.fn();
});

describe('LoadCommand', () => {
  test('Given Successful Exection, Expect Successful Result', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeTruthy();
    expect(cmd.execute).toBeCalled();
  });
  
  test('Given Member Is Null, Expect Failed Result', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const message = {
      member: null
    } as unknown as Message;

    const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Member is not part of message");
    expect(cmd.execute).not.toBeCalled();
  });
  
  test('Given User Does Have Role, Expect Successful Result', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeTruthy();
    expect(cmd.execute).toBeCalled();
  });
  
  test('Given User Does Not Have Role, Expect Failed Result', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(false),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const cmd = mock<Command>();
    cmd._roles = [ "Moderator" ];

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("You require the `Moderator` role to run this command");
    expect(cmd.execute).not.toBeCalled();
  });

  test('Given command is set to disabled, Expect command to not fire', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'test',
      COMMANDS_DISABLED_MESSAGE: 'disabled',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const messageReply = jest.spyOn(message, 'reply');

    const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command is disabled");
    expect(messageReply).toBeCalledWith("disabled");
    expect(cmd.execute).not.toBeCalled();
  });

  test('Given command COMMANDS_DISABLED_MESSAGE is empty, Expect default message sent', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'test',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const messageReply = jest.spyOn(message, 'reply');

    const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command is disabled");
    expect(messageReply).toBeCalledWith("This command is disabled.");
    expect(cmd.execute).not.toBeCalled();
  });

  test('Given a different command is disabled, Expect command to still fire', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'other',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const cmd = mock<Command>();
    const otherCmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const otherCommandItem: ICommandItem = {
          Name: "other",
          Command: otherCmd,
        }

        const commands: ICommandItem[] = [ commandItem, otherCommandItem ];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeTruthy();
    expect(cmd.execute).toBeCalled();
    expect(otherCmd.execute).not.toBeCalled();
  });

  test('Given command is not found in register, expect command not found error', async () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

    const commands: ICommandItem[] = [];
  
    const util = new Util();
  
    const result = await util.loadCommand("test", [ "first" ], message, commands);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe('Command not found');
    expect(message.reply).toBeCalledWith('Command not found');
  });
});

describe('LoadEvents', () => {
  test('Given Events Are Loaded, Expect Successful Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const client = {
      on: jest.fn(),
    } as unknown as Client;

    const evt = mock<Event>();

    const eventItem: IEventItem = {
      Event: evt
    };

    const eventItems: IEventItem[] = [ eventItem ];
  
    const util = new Util();
  
    const result = util.loadEvents(client, eventItems);
  
    const clientOn = jest.spyOn(client, 'on');
  
    expect(result.valid).toBeTruthy();
    expect(clientOn).toBeCalledTimes(13);
  });
  
  test('Given No Events Found, Expect Successful Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    const client = {
      on: jest.fn(),
    } as unknown as Client;

    const eventItems: IEventItem[] = [];
  
    const util = new Util();
  
    const result = util.loadEvents(client, eventItems);
  
    const clientOn = jest.spyOn(client, 'on');
  
    expect(result.valid).toBeTruthy();
    expect(clientOn).toBeCalledTimes(0);
  });
});
