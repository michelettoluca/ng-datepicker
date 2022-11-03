import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarService } from "../calendar.service";
import { map, Observable } from "rxjs";
import { DateTime } from "luxon";

const OFFSET = 4;

@Component({
    selector: "ngl-calendar-years",
    templateUrl: "years.component.html",
    styleUrls: ["./years.component.scss", "../calendar-grid.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearsComponent {
    constructor(public calendar: CalendarService) {
    }

    public years$: Observable<DateTime[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {
            const now = DateTime.now();
            const page = Math.floor((period.year + OFFSET - now.year) / 12);

            return Array.from(
                { length: 12 },
                (_, index) => now.plus({ year: index + page * 12 - OFFSET }));
        })
    );
}
