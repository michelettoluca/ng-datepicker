import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { DatepickerModule } from "./components/datepicker/datepicker.module";

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, DatepickerModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
