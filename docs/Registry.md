# Registry

The registry file is what is used to register the bot's commands and events. This is a script which is ran at startup and adds all the commands and events to the bot.

Although you can register these outside of the registry file, this script makes it a centralised place for it to be done at.

## Adding Commands

Commands are added in the `RegisterCommands` function.

The basic syntax is as follows:

```ts
client.RegisterCommand("Name", new Command(), "ServerId");
```

- `"Name"`: The name of the command, will be used by the user to call the command
- `new Command()`: The command class to be executed, must inherit the Command class
- `"ServerId"` (Optional): If given, will only be usable in that specific server

## Adding Events

Events are added in the `RegisterEvents` function.

The basic syntax is as follows:

```ts
client.RegisterEvent(new Events());
```

- `new Events()`: The event class to be executed