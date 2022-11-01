import { Component } from "@angular/core";
import { DatePickerConfig } from "./components/datepicker/calendar/calendar.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    config: DatePickerConfig = {
        granularity: "day",
        initialView: "year",
        selectionType: "range",
    }
}
