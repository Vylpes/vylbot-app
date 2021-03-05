export default class ConfigurationError extends Error {
    constructor(config: string) {
        super(`Invalid Configuration: ${config}`);

        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}