import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarService } from "../calendar.service";
import { Info } from "luxon";

export interface CalendarMonth {
  value: number;
  displayValue: string;
}

@Component({
  selector: "calendar-months",
  templateUrl: "months.component.html",
  styleUrls: ["./months.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsComponent {
  constructor(public calendar: CalendarService) {
  }

  public months: CalendarMonth[] = Array.from(
    { length: 12 },
    (_, index) => {
      const value = index + 1;
      const displayValue = Info.months("short")[index];

      return { value, displayValue };
    });
}
