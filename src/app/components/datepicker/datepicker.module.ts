import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatepickerComponent } from "./datepicker.component";
import { DaysComponent } from "./calendar/days/days.component";
import { YearsComponent } from "./calendar/years/years.component";
import { MonthsComponent } from "./calendar/months/months.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarService } from "./calendar/calendar.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NglClickOutside } from "../../classes/ngl-click-outside";
import { NglCell } from "./calendar/cell/cell.component";

@NgModule({
    declarations: [DatepickerComponent, CalendarComponent, YearsComponent, MonthsComponent, DaysComponent, NglCell, NglClickOutside],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
    providers: [CalendarService],
    exports: [DatepickerComponent]
})
export class DatepickerModule {
}
