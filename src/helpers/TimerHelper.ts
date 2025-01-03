import {CronJob} from "cron";
import {primitive} from "../type/primitive";
import {v4} from "uuid";

interface Timer {
    id: string;
    job: CronJob;
    context: Map<string, primitive>;
    onTick: ((context: Map<string, primitive>) => void) | ((context: Map<string, primitive>) => Promise<void>);
    runOnStart: boolean;
}

export default class TimerHelper {
    private _timers: Timer[];

    constructor() {
        this._timers = [];
    }

    public AddTimer(
        cronTime: string,
        timeZone: string,
        onTick: ((context: Map<string, primitive>) => void) | ((context: Map<string, primitive>) => Promise<void>),
        runOnStart: boolean = false): string {
        const context = new Map<string, primitive>();

        const job = new CronJob(
            cronTime,
            () => {
                onTick(context);
            },
            null,
            false,
            timeZone,
        );

        const id = v4();

        this._timers.push({
            id,
            job,
            context,
            onTick,
            runOnStart,
        });

        return id;
    }

    public StartAllTimers() {
        this._timers.forEach(timer => this.StartJob(timer));
    }

    public StopAllTimers() {
        this._timers.forEach(timer => timer.job.stop());
    }

    public StartTimer(id: string) {
        const timer = this._timers.find(x => x.id == id);

        if (!timer) return;

        this.StartJob(timer);
    }

    public StopTimer(id: string) {
        const timer = this._timers.find(x => x.id == id);

        if (!timer) return;

        timer.job.stop();
    }

    private StartJob(timer: Timer) {
        timer.job.start();

        if (timer.runOnStart) {
            timer.onTick(timer.context);
        }
    }
}
