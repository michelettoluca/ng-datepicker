import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { CalendarService } from "../calendar.service";
import { map, Observable } from "rxjs";


export interface CalendarYear {
   value: number;
   displayValue: string;
}

@Component({
   selector: "calendar-years",
   templateUrl: "years.component.html",
   styleUrls: ["./years.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearsComponent {

   constructor(public calendar: CalendarService) {
   }

   public years$: Observable<CalendarYear[]> = this.calendar.uiState.$.pipe(
      map(({ period }) => {
         return Array.from(
            { length: 12 },
            (_, index) => {
               const value = period.year - 4 + index;
               const displayValue = value.toString();

               return { value, displayValue };
            });
      })
   );
}
