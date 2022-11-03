import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarService } from "../calendar.service";
import { DateTime } from "luxon";
import { map, Observable } from "rxjs";

@Component({
    selector: "ngl-calendar-months",
    templateUrl: "months.component.html",
    styleUrls: ["./months.component.scss", "../calendar-grid.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsComponent {
    constructor(public calendar: CalendarService) {
    }

    public months$: Observable<DateTime[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {
            const periodStart = period.startOf("year");

            return Array.from(
                { length: 12 },
                (_, index) => periodStart.plus({ month: index }));
        })
    );
}
