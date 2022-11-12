import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from "@angular/core";
import { CalendarService, DatePickerConfig, Direction } from "./calendar.service";
import { DateTime } from "luxon";

@Component({
    selector: "ngl-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
    providers: [CalendarService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
    constructor(public calendar: CalendarService) {
    }

    @Input()
    public set config(config: DatePickerConfig) {
        this.calendar.config = config;
    }

    @Input()
    public set value(value: string | string[] | null) {
        if (!value) {
            this.calendar.value = null;

            return;
        }

        this.calendar.value = Array.isArray(value)
            ? value.map(v => DateTime.fromISO(v))
            : DateTime.fromISO(value);
    }

    @Output()
    public select = new EventEmitter();

    public previousPeriod() {
        this.calendar.changePeriod(Direction.PREVIOUS);
    }

    public nextPeriod() {
        this.calendar.changePeriod(Direction.NEXT);
    }

    public previousView() {
        this.calendar.previousView();
    }
}
