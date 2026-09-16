import { EventType } from "../constants/EventType";

export default interface IEventItem {
    EventType: EventType,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- the function parameters can't be determined now, however the discord api will handle it
    ExecutionFunction: Function,
}