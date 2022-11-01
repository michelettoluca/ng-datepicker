import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarService, PartialObjDate } from "../calendar.service";
import { DateTime } from "luxon";
import { map, Observable } from "rxjs";

export interface CalendarMonth {
    value: DateTime;
    displayValue: string;
    isToday: boolean;
}

const today = DateTime.now();

@Component({
    selector: "calendar-months",
    templateUrl: "months.component.html",
    styleUrls: ["./months.component.scss", "../calendar-grid-item.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsComponent {
    constructor(public calendar: CalendarService) {
    }

    public months$: Observable<CalendarMonth[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {

            const firstMonthOfTheYear = period.startOf("year");

            return Array.from(
                { length: 12 },
                (_, index) => {
                    const value = firstMonthOfTheYear.plus({
                        month: index
                    });
                    const displayValue = value.monthShort;
                    const isToday = value.hasSame(today, "year")
                        && value.hasSame(today, "month");

                    return { value, displayValue, isToday };
                });
        })
    );

    public isSelected(month: DateTime) {
        let result: boolean = false;

        const tmpValue = this.calendar.tmpValue.current;
        const value = this.calendar.value.current;

        if (MonthsComponent.checkDay(tmpValue, month)) {
            result = true;
        }

        if (Array.isArray(value)) {
            for (const _value of value) {
                if (MonthsComponent.checkDay(_value, month)) {
                    result = true;
                }
            }
        } else if (value) {
            if (MonthsComponent.checkDay(value, month)) {
                result = true;
            }
        }

        return result;
    }

    private static checkDay(day: PartialObjDate | DateTime, value: DateTime) {
        if (DateTime.isDateTime(day)) {
            day = day.toObject();
        }

        return day.year === value?.year
            && day.month === value?.month;
    }
}
