import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Minesweeper from "../../src/commands/minesweeper";

describe('Minesweeper', () => {
    let minesweeper: Minesweeper;

    beforeEach(() => {
        minesweeper = new Minesweeper();
    });

    describe('constructor', () => {
        test('EXPECT command to be configured correctly', () => {
            expect(minesweeper.CommandBuilder).toBeInstanceOf(SlashCommandBuilder);
            expect(minesweeper.CommandBuilder.name).toBe('minesweeper');
            expect(minesweeper.CommandBuilder.description).toBe('Generate a 9x9 minesweeper grid with 10 mines');
        });
    });

    describe('execute', () => {
        let interaction: jest.Mocked<CommandInteraction>;
        let generateGridMock: jest.SpyInstance;
        let formatGridMock: jest.SpyInstance;

        beforeEach(async () => {
            interaction = {
                reply: jest.fn(),
            } as unknown as jest.Mocked<CommandInteraction>;

            const mockGrid = [
                ['1', 'M', '1'],
                ['1', '1', '1'],
                ['0', '0', '0']
            ];

            generateGridMock = jest.spyOn(minesweeper, 'generateGrid').mockReturnValue(mockGrid);
            formatGridMock = jest.spyOn(minesweeper, 'formatGrid').mockReturnValue('formatted grid');

            await minesweeper.execute(interaction);
        });

        test('EXPECT generateGrid to be called with correct parameters', () => {
            expect(generateGridMock).toHaveBeenCalledWith(9, 9, 10);
        });

        test('EXPECT formatGrid to be called with generated grid', () => {
            expect(formatGridMock).toHaveBeenCalledWith([
                ['1', 'M', '1'],
                ['1', '1', '1'],
                ['0', '0', '0']
            ]);
        });

        test('EXPECT interaction.reply to be called with formatted grid', () => {
            expect(interaction.reply).toHaveBeenCalledWith('formatted grid');
        });
    });

    describe('generateGrid', () => {
        test('EXPECT grid to have correct dimensions', () => {
            const grid = minesweeper.generateGrid(5, 5, 3);

            expect(grid.length).toBe(5);
            expect(grid[0].length).toBe(5);
        });

        test('EXPECT grid to have correct number of mines', () => {
            const grid = minesweeper.generateGrid(9, 9, 10);
            
            let mineCount = 0;
            for (const row of grid) {
                for (const cell of row) {
                    if (cell === 'M') {
                        mineCount++;
                    }
                }
            }

            expect(mineCount).toBe(10);
        });

        test('EXPECT numbers to correctly count adjacent mines', () => {
            const grid = [
                ['M', '0', '0'],
                ['0', '0', '0'],
                ['0', '0', '0']
            ];

            jest.spyOn(Math, 'random').mockReturnValue(0);
            const result = minesweeper.generateGrid(3, 3, 1);

            let mineRow = -1;
            let mineCol = -1;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (result[i][j] === 'M') {
                        mineRow = i;
                        mineCol = j;
                    }
                }
            }

            expect(mineRow).toBeGreaterThanOrEqual(0);
            expect(mineCol).toBeGreaterThanOrEqual(0);

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;

                    const newRow = mineRow + dr;
                    const newCol = mineCol + dc;

                    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                        expect(result[newRow][newCol]).toBe('1');
                    }
                }
            }

            (Math.random as jest.Mock).mockRestore();
        });

        test('EXPECT cells with no adjacent mines to be 0', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
            const grid = minesweeper.generateGrid(5, 5, 1);

            let zeroCount = 0;
            for (const row of grid) {
                for (const cell of row) {
                    if (cell === '0') {
                        zeroCount++;
                    }
                }
            }

            expect(zeroCount).toBeGreaterThan(0);

            (Math.random as jest.Mock).mockRestore();
        });

        test('EXPECT all cells to be valid values', () => {
            const grid = minesweeper.generateGrid(9, 9, 10);
            const validValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'M'];

            for (const row of grid) {
                for (const cell of row) {
                    expect(validValues).toContain(cell);
                }
            }
        });
    });

    describe('formatGrid', () => {
        test('EXPECT grid to be formatted with spoiler tags and emojis', () => {
            const grid = [
                ['0', '1', '2'],
                ['M', '3', '4']
            ];

            const result = minesweeper.formatGrid(grid);

            expect(result).toContain('||:zero:||');
            expect(result).toContain('||:one:||');
            expect(result).toContain('||:two:||');
            expect(result).toContain('||:bomb:||');
            expect(result).toContain('||:three:||');
            expect(result).toContain('||:four:||');
        });

        test('EXPECT rows to be separated by newlines', () => {
            const grid = [
                ['0', '1'],
                ['2', '3']
            ];

            const result = minesweeper.formatGrid(grid);
            const lines = result.split('\n').filter(line => line.trim() !== '');

            expect(lines.length).toBe(2);
        });

        test('EXPECT each cell to be followed by a space', () => {
            const grid = [['0', '1', '2']];

            const result = minesweeper.formatGrid(grid);

            expect(result).toMatch(/\|\|:\w+:\|\| \|\|:\w+:\|\| \|\|:\w+:\|\| /);
        });

        test('EXPECT all mine emoji mappings to work', () => {
            const grid = [['M']];
            const result = minesweeper.formatGrid(grid);
            expect(result).toContain('||:bomb:||');
        });

        test('EXPECT all number emoji mappings to work', () => {
            const grid = [['0', '1', '2', '3', '4', '5', '6', '7', '8']];
            const result = minesweeper.formatGrid(grid);

            expect(result).toContain('||:zero:||');
            expect(result).toContain('||:one:||');
            expect(result).toContain('||:two:||');
            expect(result).toContain('||:three:||');
            expect(result).toContain('||:four:||');
            expect(result).toContain('||:five:||');
            expect(result).toContain('||:six:||');
            expect(result).toContain('||:seven:||');
            expect(result).toContain('||:eight:||');
        });
    });
});
