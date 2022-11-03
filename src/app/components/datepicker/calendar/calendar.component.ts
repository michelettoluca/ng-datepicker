import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { CalendarService, DatePickerConfig } from "./calendar.service";

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
        this.calendar.init();
    }

    @Output() public eventEmitter = new EventEmitter();

    public handleClickOutside() {
        this.eventEmitter.emit()
    }


    public previousPeriod() {
        this.calendar.changePeriod("previous");
    };

    public nextPeriod() {
        this.calendar.changePeriod("next");
    };

    public previousView() {
        this.calendar.previousView();
    }

}
