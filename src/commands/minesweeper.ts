import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../type/command";

export default class Minesweeper extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('minesweeper')
            .setDescription('Generate a 9x9 minesweeper grid with 10 mines');
    }

    public override async execute(interaction: CommandInteraction) {
        const grid = this.generateGrid(9, 9, 10);
        const formattedGrid = this.formatGrid(grid);

        await interaction.reply(formattedGrid);
    }

    public generateGrid(width: number, height: number, mineCount: number): string[][] {
        const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill('0'));
        
        const positions: number[] = [];
        for (let i = 0; i < width * height; i++) {
            positions.push(i);
        }
        
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        const minePositions = positions.slice(0, mineCount);
        
        for (const pos of minePositions) {
            const row = Math.floor(pos / width);
            const col = pos % width;
            grid[row][col] = 'M';
        }
        
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (grid[row][col] !== 'M') {
                    let count = 0;
                    
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            
                            const newRow = row + dr;
                            const newCol = col + dc;
                            
                            if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
                                if (grid[newRow][newCol] === 'M') {
                                    count++;
                                }
                            }
                        }
                    }
                    
                    grid[row][col] = count.toString();
                }
            }
        }
        
        return grid;
    }

    public formatGrid(grid: string[][]): string {
        const emojiMap: { [key: string]: string } = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            'M': ':bomb:'
        };

        let result = '';
        for (const row of grid) {
            for (const cell of row) {
                const emoji = emojiMap[cell];
                result += `||${emoji}|| `;
            }
            result += '\n';
        }
        
        return result;
    }
}
