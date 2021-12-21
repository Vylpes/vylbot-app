import { Command } from "../../../src/type/command";

export default class normal extends Command {
    constructor() {
        super();
        this._category = "General";
    }
}
