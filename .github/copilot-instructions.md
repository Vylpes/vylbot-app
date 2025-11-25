# VylBot App - GitHub Copilot Instructions

## Project Overview
VylBot App is a Discord bot built with discord.js for Vylpes' Den Discord Server. It provides moderation, entertainment, and utility features for Discord communities.

## Tech Stack
- **Runtime**: Node.js v20
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: Yarn
- **Framework**: discord.js v14.3.0
- **Database**: MySQL with TypeORM 0.3.20
- **Testing**: Jest with ts-jest
- **Build**: TypeScript Compiler (tsc)

## Project Structure

```
src/
├── buttonEvents/          # Button interaction handlers
├── client/               # Discord client setup and event handlers
├── commands/             # Slash command implementations
├── constants/            # Application constants (e.g., EmbedColours)
├── contracts/            # TypeScript interfaces and contracts
├── database/             # Database entities, migrations, and data sources
│   ├── entities/         # TypeORM entities
│   ├── migrations/       # Database migrations
│   └── dataSources/      # Database connection configuration
├── events/               # Discord event handlers (message, member events)
├── helpers/              # Helper utilities (e.g., SettingsHelper)
├── timers/               # Scheduled tasks and cron jobs
├── type/                 # Abstract base classes (Command, ButtonEvent)
├── registry.ts           # Central registration for commands, events, and buttons
└── vylbot.ts            # Application entry point

tests/
├── buttonEvents/         # Button event tests
├── commands/             # Command tests
└── database/             # Database entity tests
```

## Architecture Patterns

### Commands
- **Location**: `src/commands/`
- **Base Class**: Extend `Command` from `src/type/command.ts`
- **Pattern**:
  ```typescript
  export default class MyCommand extends Command {
      constructor() {
          super();
          this.CommandBuilder = new SlashCommandBuilder()
              .setName("commandname")
              .setDescription("Description");
      }

      public override async execute(interaction: CommandInteraction) {
          // Implementation
      }
  }
  ```
- **Registration**: Add to `src/registry.ts` in `RegisterCommands()`
- **Subcommands**: Can be split into separate files (e.g., `commands/Role/config.ts`)
- **Server-specific**: Some commands can be registered for specific guild IDs

### Button Events
- **Location**: `src/buttonEvents/`
- **Base Class**: Extend `ButtonEvent` from `src/type/buttonEvent.ts`
- **Pattern**:
  ```typescript
  export default class MyButton extends ButtonEvent {
      public override async execute(interaction: ButtonInteraction): Promise<void> {
          const action = interaction.customId.split(" ")[1];
          
          switch (action) {
              case "action":
                  await this.handleAction(interaction);
                  break;
          }
      }
  }
  ```
- **CustomId Format**: `"prefix action param1 param2"`
- **Registration**: Add to `src/registry.ts` in `RegisterButtonEvents()`

### Database Entities
- **ORM**: TypeORM with decorators
- **Pattern**: Entities should have static methods for fetching (e.g., `FetchOneByKey`, `FetchMoonCountByUserId`)
- **Save Pattern**: `await entity.Save(EntityClass, entity)`
- **Migrations**: Use `yarn db:create` to generate, `yarn db:up` to apply

### Events
- **Location**: `src/events/`
- **Registration**: Add to `src/registry.ts` in `RegisterEvents()`
- **EventTypes**: Defined in `src/constants/EventType.ts`

## Code Style Guidelines

### TypeScript/JavaScript Conventions
- **Variable Names**: camelCase
- **Braces**: Same line style
  ```typescript
  function example() {  // ✓ Correct
      // code
  }
  ```
- **No Comma Dangle**: Last item in object/array should not have trailing comma
- **Arrow Functions**:
  - Braces only when needed: `x => x * 2` not `x => { return x * 2; }`
  - Parentheses only when needed: `x => x * 2` not `(x) => x * 2`
  - Space around arrow: `x => y` not `x=>y`
- **Prefer**: `const` and `let` over `var`
- **Strict Mode**: TypeScript strict mode is enabled
- **Property Initialization**: `strictPropertyInitialization` is disabled in tsconfig

### Discord.js Patterns
- **Embeds**: Use `EmbedBuilder` with `EmbedColours` constants
- **Buttons**: Use `ActionRowBuilder<ButtonBuilder>` with `ButtonStyle`
- **Interactions**: Always check interaction type first
- **Defer**: Use `await interaction.deferReply()` for long-running operations
- **Ephemeral**: Use `ephemeral: true` for error messages or private responses

### Permissions
- Use `PermissionsBitField.Flags.PermissionName` for permission checks
- Check guild context before accessing guild-specific data

## Testing Guidelines

### Test Structure
- **Framework**: Jest with ts-jest
- **Location**: Mirror source structure in `tests/` directory
- **Naming**: `*.test.ts` files
- **Pattern**: Use `GIVEN/WHEN/THEN` style describe blocks:
  ```typescript
  describe("GIVEN condition", () => {
      beforeEach(async () => {
          // Setup
      });

      test("EXPECT expected behavior", () => {
          // Assertions
      });
  });
  ```

### Mocking
- Mock Discord.js interactions with `as unknown as CommandInteraction`
- Mock external dependencies (e.g., `jest.mock("random-bunny")`)
- Use `jest.fn()` for spy functions
- Clear mocks between tests with `mockFn.mockClear()`

### Coverage
- Test happy paths and error cases
- Test permission checks and validation
- Test null/undefined edge cases
- Use snapshots for complex objects (with `expect.any()` for dynamic fields)

### Running Tests
- All tests: `npm test`
- Specific test: `npm test -- pattern`
- Must pass before PR acceptance

## Common Patterns

### Embed Creation
```typescript
const embed = new EmbedBuilder()
    .setColor(EmbedColours.Ok)
    .setTitle("Title")
    .setDescription("Description")
    .addFields([
        { name: "Field", value: "Value", inline: true }
    ]);

await interaction.reply({ embeds: [embed] });
```

### Button Creation
```typescript
const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`prefix action ${param}`)
            .setLabel("Label")
            .setStyle(ButtonStyle.Primary)
    );

await interaction.reply({ content: "Message", components: [row] });
```

### Permission Checks
```typescript
const member = interaction.guild.members.cache.get(interaction.user.id);
const hasPermission = member?.permissions.has(PermissionsBitField.Flags.ManageMessages);

if (!hasPermission) {
    await interaction.reply({
        content: "You do not have permission.",
        ephemeral: true
    });
    return;
}
```

### Database Operations
```typescript
// Fetch
const setting = await UserSetting.FetchOneByKey(userId, "key");

// Create/Update
if (setting) {
    setting.UpdateValue("new value");
} else {
    setting = new UserSetting(userId, "key", "value");
}

await setting.Save(UserSetting, setting);
```

## Development Workflow

### Setup
```bash
yarn install
yarn build
```

### Database
```bash
docker compose up -d              # Start database
yarn db:create <migration-name>  # Create migration
yarn db:up                        # Run migrations
yarn db:down                      # Revert migration
```

### Running
```bash
yarn start  # Start bot
yarn test   # Run tests
```

### Before Committing
1. Run tests: `yarn test`
2. Build: `yarn build`
3. Verify no TypeScript errors
4. Follow contribution guidelines in CONTRIBUTING.md

## Environment Configuration
- Copy `.env.template` to `.env`
- Never commit `.env` files
- Required environment variables documented in template

## Server-Specific Features
Some commands are guild-specific (e.g., guild ID `304276391837302787` or `501231711271780357`). These are organized in subdirectories under `src/commands/` and `src/buttonEvents/`.

## Key Principles
1. **Minimal Changes**: Make surgical, precise edits
2. **Type Safety**: Leverage TypeScript strict mode
3. **Error Handling**: Always handle interaction errors gracefully
4. **User Experience**: Use ephemeral messages for errors
5. **Testing**: Every feature needs corresponding tests
6. **Documentation**: Update docs when changing behavior
7. **Consistency**: Follow existing patterns in the codebase

## Resources
- Discord.js Documentation: https://discord.js.org/
- TypeORM Documentation: https://typeorm.io/
- Project Repository: https://github.com/Vylpes/vylbot-app
- Support: #development channel in Discord or helpdesk@vylpes.com
