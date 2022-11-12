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
export class DatepickerComponent extends BaseValueAccessor<String | String[]> {
    public aa: string = "2010-08-15T00:00:00.000+02:00";

    @Input()
    public config!: DatePickerConfig;

    public showCalendar: boolean = true;

    handleClickOutside() {
        this.showCalendar = false;
    }

    toggleShowPopout(event: Event) {
        event.stopPropagation();
        this.showCalendar = !this.showCalendar;
    }
}
