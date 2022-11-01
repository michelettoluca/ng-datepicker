import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { map, Observable } from "rxjs";
import { CalendarService, PartialObjDate } from "../calendar.service";
import { DateTime, Info } from "luxon";

export interface CalendarDay {
    value: DateTime;
    displayValue: number;
    isToday: boolean;
    isCurrentMonth: boolean;
}

const today = DateTime.now();

@Component({
    selector: "calendar-days",
    templateUrl: "./days.component.html",
    styleUrls: ["./days.component.scss", "../calendar-grid-item.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysComponent {
    constructor(public calendar: CalendarService) {
    }

    public weekdays = Info.weekdaysFormat("short");

    public days$: Observable<CalendarDay[]> = this.calendar.uiState.$.pipe(
        map(({ period }) => {
            const firstDayOfTheMonth = period.startOf("month");

            return Array.from(
                { length: 7 * 6 },
                (_, index) => {
                    const value = firstDayOfTheMonth.plus({
                        day: index - firstDayOfTheMonth.weekday + 1
                    });

                    const displayValue = value.day;

                    const isToday = value.hasSame(today, "year")
                        && value.hasSame(today, "month")
                        && value.hasSame(today, "day");

                    const isCurrentMonth = value.hasSame(period, "month");

                    return { value, displayValue, isToday, isCurrentMonth };
                }
            );
        })
    );

    public isSelected(day: DateTime) {
        let result: boolean = false;

        const tmpValue = this.calendar.tmpValue.current;
        const value = this.calendar.value.current;

        if (DaysComponent.checkDay(tmpValue, day)) {
            result = true;
        }

        if (Array.isArray(value)) {
            for (const _value of value) {
                if (DaysComponent.checkDay(_value, day)) {
                    result = true;
                }
            }
        } else if (value) {
            if (DaysComponent.checkDay(value, day)) {
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
            && day.month === value?.month
            && day.day === value?.day;
    }

}

