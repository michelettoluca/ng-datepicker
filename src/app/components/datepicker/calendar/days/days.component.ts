import { ChangeDetectionStrategy, Component } from "@angular/core";
import { map, Observable } from "rxjs";
import { CalendarService } from "../calendar.service";
import { DateTime, Info } from "luxon";

@Component({
    selector: "ngl-calendar-days",
    templateUrl: "./days.component.html",
    styleUrls: ["./days.component.scss", "../calendar-grid.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysComponent {
    constructor(public calendar: CalendarService) {
    }

    public weekdays = Info.weekdaysFormat("short", {locale: "en"});

    public days$: Observable<DateTime[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {
            const periodStart = period.startOf("month");

            return Array.from(
                { length: 7 * 6 },
                (_, index) => periodStart.plus({ day: index - periodStart.weekday + 1 }));
        })
    );
}

