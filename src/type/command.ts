import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";

export class Command {
    public _roles: string[];

    public _category?: string;

    constructor() {
        this._roles = [];
    }

    public precheck(context: ICommandContext): CommandResponse {
        return CommandResponse.Ok;
    }

    public async precheckAsync(context: ICommandContext): Promise<CommandResponse> {
        return CommandResponse.Ok;
    }

    public execute(context: ICommandContext) {

    }
}
