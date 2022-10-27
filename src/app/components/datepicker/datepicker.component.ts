import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatePickerConfig } from "./calendar/calendar.service";
import { BaseValueAccessor } from "../../classes/BaseValueAccessor";

@Component({
  selector: "datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrls: ["./datepicker.component.scss"],
  providers: [...BaseValueAccessor.makeProviders(DatepickerComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent extends BaseValueAccessor {
  constructor() {
    super();
  }

  @Input() public config!: DatePickerConfig;

  public showCalendar: boolean = true;

  toggleShowPopout() {
    this.showCalendar = !this.showCalendar;
  }
}
