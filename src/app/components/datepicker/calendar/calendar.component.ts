import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CalendarService, DatePickerConfig, Period } from "./calendar.service";
import { DateTime } from "luxon";

@Component({
   selector: "calendar",
   templateUrl: "./calendar.component.html",
   styleUrls: ["./calendar.component.scss"],
   providers: [CalendarService],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
   constructor(public calendar: CalendarService) {
   }

   @Input()
   public set config(config: DatePickerConfig) {
      this.calendar.config = config;
   }

   public previousPeriod() {
      this.calendar.changePeriod("previous");
   };

   public nextPeriod() {
      this.calendar.changePeriod("next");
   };


}
