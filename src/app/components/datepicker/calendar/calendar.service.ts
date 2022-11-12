import { Injectable } from "@angular/core";
import { DateTime } from "luxon";
import { DurationUnit } from "luxon/src/duration";
import { ObservableState } from "../../../classes/ObservableState";

export type SelectionType = "single" | "multiple" | "range";
export type Period = "year" | "month" | "day";

export enum Direction {
    NEXT = 1,
    PREVIOUS = -1
}

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

    public value: CalendarValue = null;
    public tmpValue: PartialObjDate = {};

    public uiState = new ObservableState<UIState>(initialUIState);

    public init(config: DatePickerConfig) {
        this.config = config;
        this.uiState.current = {
            view: this.config.initialView || initialUIState.view,
            period: this.config.initialPeriod || initialUIState.period
        };
    }

    public changePeriod(direction: Direction) {
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

        const newPeriod = period.plus({ [durationUnit]: offset * direction });

        this.uiState.current = {
            ...this.uiState.current,
            period: newPeriod
        };
    }

    public handleSelection(value: DateTime) {
        const { granularity, selectionType } = this.config;
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

                nextView = "day"; // TODO: Change when implementing time
                break;
        }

        this.tmpValue = tmpValue;

        this.uiState.current = {
            view: granularity === view ? view : nextView,
            period: view === "day" ? period : DateTime.fromObject(this.tmpValue)
        };

        if (granularity === view) {
            const newValue = DateTime.fromObject(this.tmpValue);

            switch (selectionType) {
                case "single":
                    this.value = newValue;
                    break;

                case "multiple":
                    this.value = Array.isArray(this.value)
                        ? this.value.find(value => value.equals(newValue))
                            ? this.value.filter(value => !value.equals(newValue))
                            : [...this.value, newValue]
                        : [newValue];
                    break;

                case "range":
                    this.value = Array.isArray(this.value) && this.value.length === 1
                        ? this.value[0] > newValue
                            ? [newValue.startOf(granularity), this.value[0].endOf(granularity)]
                            : [this.value[0].startOf(granularity), newValue.endOf(granularity)]
                        : [newValue.startOf(granularity)];
                    break;
            }

            this.tmpValue = {};
        }
    }

    public previousView() {
        const { view } = this.uiState.current;

        switch (view) {
            case "month":
                this.uiState.current = {
                    ...this.uiState.current,
                    view: "year"
                }

                this.tmpValue = {
                    ...this.tmpValue,
                    year: undefined
                };
                break;

            case "day":
                this.uiState.current = {
                    ...this.uiState.current,
                    view: "month"
                }

                this.tmpValue = {
                    ...this.tmpValue,
                    month: undefined
                };
                break;
        }
    }
}

