import { Injectable } from "@angular/core";
import { DateTime } from "luxon";
import { DurationUnit } from "luxon/src/duration";
import { ObservableState } from "../../../classes/ObservableState";

export type SelectionType = "single" | "multiple" | "range";
export type Period = "year" | "month" | "day";

export interface DatePickerConfig {
    selectionType: SelectionType;
    granularity: Period;
    initialView?: Period;
    initialPeriod?: DateTime;
    toFormat?: string;
}

export type CalendarValue = DateTime | DateTime[] | null;

export interface PartialObjDate {
    year?: number,
    month?: number,
    day?: number,
}

export interface UIState {
    view: Period;
    period: DateTime;
}

const initialUIState: UIState = {
    view: "day",
    period: DateTime.now()
};

@Injectable()
export class CalendarService {
    public config: DatePickerConfig = {
        granularity: "day",
        selectionType: "single",
        initialPeriod: DateTime.now()
    };

    public value = new ObservableState<CalendarValue>(null);
    public tmpValue = new ObservableState<PartialObjDate>({});
    public uiState = new ObservableState<UIState>(initialUIState);

    public init() {
        this.uiState.current = {
            view: this.config.initialView || initialUIState.view,
            period: this.config.initialPeriod || initialUIState.period
        };
    }


    public changePeriod(direction: "previous" | "next") {
        const { period, view } = this.uiState.current;

        let durationUnit: DurationUnit;
        let offset: number;

        switch (view) {
            case "day":
                durationUnit = "months";
                offset = 1;
                break;

            case "month":
                durationUnit = "years";
                offset = 1;
                break;

            case "year":
                durationUnit = "years";
                offset = 12;
                break;
        }

        offset = direction === "next"
            ? offset
            : -offset;

        const newPeriod = period.plus({ [durationUnit]: offset });

        this.uiState.current = {
            ...this.uiState.current,
            period: newPeriod
        };
    }

    public handleSelection(value: DateTime) {
        const { granularity, initialView } = this.config;
        const { view, period } = this.uiState.current;

        let tmpValue: PartialObjDate;
        let nextView: Period;

        switch (view) {
            case "year":
                tmpValue = {
                    year: value.year
                };
                nextView = "month";
                break;

            case "month":
                tmpValue = {
                    year: value.year,
                    month: value.month
                };
                nextView = "day";
                break;

            case "day":
                tmpValue = {
                    year: value.year,
                    month: value.month,
                    day: value.day
                };
                break;
        }

        this.tmpValue.current = tmpValue;

        this.uiState.current = {
            view: granularity === view ? view : nextView!,
            period: view === "day" ? period : DateTime.fromObject(this.tmpValue.current)
        };

        if (granularity === view) {
            this.setValue(this.tmpValue.current);

            this.tmpValue.current = {};
        }
    }

    private setView(view: Period) {
        this.uiState.current = {
            ...this.uiState.current,
            view
        };
    }

    public previousView() {
        const { view } = this.uiState.current;

        switch (view) {
            case "month":
                this.setView("year");
                this.tmpValue.current = {
                    ...this.tmpValue.current,
                    year: undefined
                };
                break;

            case "day":
                this.setView("month");
                this.tmpValue.current = {
                    ...this.tmpValue.current,
                    month: undefined
                };
                break;
        }
    }

    private setValue(value: PartialObjDate) {
        const { granularity, selectionType } = this.config;

        const currentValue = this.value.current;
        const newValue = DateTime.fromObject(value);

        switch (selectionType) {
            case "single":
                this.value.current = newValue;
                break;

            case "multiple":
                this.value.current = Array.isArray(currentValue)
                    ? currentValue.find(v => v.equals(newValue))
                        ? currentValue.filter(v => !v.equals(newValue))
                        : [...currentValue, newValue]
                    : [newValue];
                break;

            case "range":
                this.value.current = Array.isArray(currentValue) && currentValue.length === 1
                    ? currentValue[0] > newValue
                        ? [newValue.startOf(granularity), currentValue[0].endOf(granularity)]
                        : [currentValue[0].startOf(granularity), newValue.endOf(granularity)]
                    : [newValue.startOf(granularity)];
                break;
        }
    }
}

