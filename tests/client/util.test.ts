import { Util } from "../../src/client/util";

import { Client, Guild, Message, Role, SnowflakeUtil, TextChannel, User } from "discord.js";
import fs from "fs";

jest.mock("fs");

beforeEach(() => {
  fs.existsSync = jest.fn();
});

describe('LoadCommand', () => {
  test('Given Successful Exection, Expect Successful Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeTruthy();
  });
  
  test('Given Member Is Null, Expect Failed Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
    const message = {
      member: null
    } as unknown as Message;
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Member is not part of message");
  });
  
  test('Given Folder Does Not Exist, Expect Failed Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(false);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command folder does not exist");
  });
  
  test('Given File Does Not Exist, Expect Failed Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValueOnce(true)
      .mockReturnValue(false);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("File does not exist");
  });
  
  test('Given User Does Have Role, Expect Successful Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("roles", [ "first" ], message);
  
    expect(result.valid).toBeTruthy();
  });
  
  test('Given User Does Not Have Role, Expect Failed Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("roles", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("You require the `Moderator` role to run this command");
  });
  
  test('Given Command Category Is Null, Expect Successful Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("noCategory", [ "first" ], message);
  
    expect(result.valid).toBeTruthy();
  });

  test('Given command is set to disabled, Expect command to not fire', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'normal',
      COMMANDS_DISABLED_MESSAGE: 'disabled',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command is disabled");
    expect(messageReply).toBeCalledWith("disabled");
  });

  test('Given command COMMANDS_DISABLED_MESSAGE is empty, Expect default message sent', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'normal',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command is disabled");
    expect(messageReply).toBeCalledWith("This command is disabled.");
  });

  test('Given a different command is disabled, Expect command to still fire', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'anything',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeTruthy();
  });

  test('Given a different command is disabled with this one, Expect command to not fire', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
      COMMANDS_DISABLED: 'normal,anything,',
    }
    
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
  
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
  
    const util = new Util();
  
    const result = util.loadCommand("normal", [ "first" ], message);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command is disabled");
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
  
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readdirSync = jest.fn().mockReturnValue(["normal.ts"]);
  
    const client = {
      on: jest.fn(),
    } as unknown as Client;
  
    const util = new Util();
  
    const result = util.loadEvents(client);
  
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
  
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readdirSync = jest.fn().mockReturnValue(["normal"]);
  
    const client = {
      on: jest.fn(),
    } as unknown as Client;
  
    const util = new Util();
  
    const result = util.loadEvents(client);
  
    const clientOn = jest.spyOn(client, 'on');
  
    expect(result.valid).toBeTruthy();
    expect(clientOn).toBeCalledTimes(0);
  });
  
  test('Given Event Folder Does Not Exist, Expect Failed Result', () => {
    process.env = {
      BOT_TOKEN: 'TOKEN',
      BOT_PREFIX: '!',
      FOLDERS_COMMANDS: 'commands',
      FOLDERS_EVENTS: 'events',
    }
  
    process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
    fs.existsSync = jest.fn().mockReturnValue(false);
    fs.readdirSync = jest.fn().mockReturnValue(["normal.ts"]);
  
    const client = {
      on: jest.fn(),
    } as unknown as Client;
  
    const util = new Util();
  
    const result = util.loadEvents(client);
  
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Event folder does not exist");
  });
});
