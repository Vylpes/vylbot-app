import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";

export class Command {
    public Roles: string[];
    public Category?: string;

    constructor() {
        this.Roles = [];
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
