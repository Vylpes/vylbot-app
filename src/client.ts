import { Client } from 'discord.js';
import ConfigurationError from './errors/ConfigurationError';

export default class client extends Client {
    private config: Object;
    private cmdConfig: Object;

    constructor(config, cmdConfig) {
        super();

        this.config = config;
        this.cmdConfig = cmdConfig;
    }

    start() {
        if (!this.config) throw new ConfigurationError('config');
        if (!this.cmdConfig) throw new ConfigurationError('cmdConfig');
    }
}