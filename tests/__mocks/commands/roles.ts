import { Command } from "../../../src/type/command";

export default class roles extends Command {
    constructor() {
        super();
        this._roles = [ "Moderator" ];
    }
}
