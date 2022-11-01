import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { CalendarService, PartialObjDate } from "../calendar.service";
import { map, Observable } from "rxjs";
import { DateTime } from "luxon";

export interface CalendarYear {
    value: DateTime;
    displayValue: number;
    isToday: boolean;
}

const OFFSET = 4;
const today = DateTime.now();

@Component({
    selector: "calendar-years",
    templateUrl: "years.component.html",
    styleUrls: ["./years.component.scss", "../calendar-grid-item.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearsComponent {

    constructor(public calendar: CalendarService) {
    }

    public years$: Observable<CalendarYear[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {
            const page = Math.floor((period.year + OFFSET - today.year) / 12);

            console.log({ page });

            return Array.from(
                { length: 12 },
                (_, index) => {
                    const value = today.plus({
                        year: index + page * 12 - OFFSET
                    });
                    const displayValue = value.year;
                    const isToday = value.hasSame(today, "year");

                    return { value, displayValue, isToday };
                });
        })
    );

    public isSelected(month: DateTime) {
        let result: boolean = false;

        const tmpValue = this.calendar.tmpValue.current;
        const value = this.calendar.value.current;

        if (this.checkDay(tmpValue, month)) {
            result = true;
        }

        if (Array.isArray(value)) {
            for (const _value of value) {
                if (this.checkDay(_value, month)) {
                    result = true;
                }
            }
        } else if (value) {
            if (this.checkDay(value, month)) {
                result = true;
            }
        }

        return result;
    }

    private checkDay(day: PartialObjDate | DateTime, value: DateTime) {
        if (DateTime.isDateTime(day)) {
            day = day.toObject();
            return day.year === value?.year;
        } else {
            return this.calendar.config.granularity === this.calendar.uiState.current.view
                && day.day === value?.year;
        }

    }
}
