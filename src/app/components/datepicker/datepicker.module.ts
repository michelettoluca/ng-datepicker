import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatepickerComponent } from "./datepicker.component";
import { DaysComponent } from "./calendar/days/days.component";
import { YearsComponent } from "./calendar/years/years.component";
import { MonthsComponent } from "./calendar/months/months.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarService } from "./calendar/calendar.service";

@NgModule({
   declarations: [DatepickerComponent, CalendarComponent, YearsComponent, MonthsComponent, DaysComponent],
   imports: [CommonModule, FormsModule, ReactiveFormsModule],
   providers: [CalendarService],
   exports: [DatepickerComponent]
})
export class DatepickerModule {
}
