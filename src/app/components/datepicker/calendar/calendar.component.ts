import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input, OnInit,
    Output,
    ViewEncapsulation
} from "@angular/core";
import { CalendarService, DatePickerConfig } from "./calendar.service";

@Component({
    selector: "sium-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
    providers: [CalendarService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
    constructor(private elementRef: ElementRef,
                public calendar: CalendarService) {
    }

    @Output() public eventEmitter = new EventEmitter();

    @HostListener("document:click", ["$event"])
    handleClickOutside(event: PointerEvent) {
        if (!event.composedPath().includes(this.elementRef.nativeElement)) {
            this.eventEmitter.emit();
        }
    }

    @Input()
    public set config(config: DatePickerConfig) {
        this.calendar.config = config;
        this.calendar.init();
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
