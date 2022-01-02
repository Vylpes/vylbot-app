import { Command } from "../../../src/type/command";

export default class MockCmd extends Command {
    constructor() {
        super();

        super._category = "General";
        super._roles = ["Moderator"];
    }
}