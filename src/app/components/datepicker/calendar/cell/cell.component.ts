import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DateTime } from "luxon";
import { CalendarService } from "../calendar.service";

@Component({
    selector: "ngl-cell",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NglCell {
    constructor(private calendar: CalendarService) {
    }

    @Input()
    public value!: DateTime;

    @Input()
    public displayValue!: string | number;

    public handleClick() {
        this.calendar.handleSelection(this.value);
    }

    public get isToday() {
        const now = DateTime.now();
        const { view } = this.calendar.uiState.current;

        switch (view) {
            case "year":
                return this.value.hasSame(now, "year");

            case "month":
                return this.value.hasSame(now, "year")
                    && this.value.hasSame(now, "month");

            case "day":
                return this.value.hasSame(now, "year")
                    && this.value.hasSame(now, "month")
                    && this.value.hasSame(now, "day");
        }
    }

    public get isActive() {
        const value = this.calendar.value;

        if (!value) {
            return false;
        }

        return Array.isArray(value)
            ? value.some(v => this.checkValue(v))
            : this.checkValue(value);
    }

    public get isCurrentPeriod() {
        const { view, period } = this.calendar.uiState.current;

        if (view !== "day") {
            return true;
        }

        return this.value.month === period.month;
    }

    public get isInRange() {
        const { selectionType } = this.calendar.config;
        const { value } = this.calendar;

        if (selectionType !== "range") {
            return false;
        }

        return Array.isArray(value)
            && this.value >= value?.[0]
            && this.value <= value?.[1];
    }

    private checkValue(value: DateTime) {
        const { view } = this.calendar.uiState.current;

        switch (view) {
            case "year":
                return this.value.year === value.year;

            case "month":
                return this.value.year === value.year
                    && this.value.month === value.month;

            case "day":
                return this.value.year === value.year
                    && this.value.month === value.month
                    && this.value.day === value.day;
        }
    }
}
