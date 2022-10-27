import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { map, Observable } from "rxjs";
import { CalendarService } from "../calendar.service";
import { Info } from "luxon";

export interface CalendarDay {
  value: number;
  displayValue: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: "calendar-days",
  templateUrl: "./days.component.html",
  styleUrls: ["./days.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysComponent {
  constructor(public calendar: CalendarService) {
  }

  public weekdays = Info.weekdaysFormat("short");

  public days$: Observable<CalendarDay[]> = this.calendar.uiState.$.pipe(
    map(({ period }) => {
      const monthStart = period.startOf("month");
      const weekdayStart = monthStart.weekday;

      return Array.from(
        { length: 7 * 6 },
        (_, index) => {
          const dateTime = monthStart.plus({ day: index - (weekdayStart - 1) });
          const isCurrentMonth = period.hasSame(dateTime, "month");

          return { value: dateTime.day, displayValue: dateTime.day, isCurrentMonth };
        });
    })
  );
}
