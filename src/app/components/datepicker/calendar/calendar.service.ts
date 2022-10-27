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

const defaultCalendarValue: CalendarValue = null;
const defaultUiState: UIState = {
  view: "day",
  period: DateTime.now()
};

@Injectable()
export class CalendarService {
  public config: DatePickerConfig = {
    granularity: "day",
    selectionType: "range",
  };

  public value = new ObservableState<CalendarValue>(defaultCalendarValue);
  public tmpValue = new ObservableState<PartialObjDate>({});
  public uiState = new ObservableState<UIState>(defaultUiState);


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

  public handleSelection(value: number) {
    console.log({ value });

    const { view } = this.uiState.current;
    const { granularity, selectionType } = this.config;


    this.tmpValue.current = {
      ...this.tmpValue.current,
      [view]: value
    };

    if (view === granularity) {
      const currentValue = this.value.current;
      const dateTimeValue = DateTime.fromObject(this.tmpValue.current);

      switch (selectionType) {
        case "single":
          this.value.current = dateTimeValue;
          break;

        case "multiple":
          this.value.current = Array.isArray(currentValue)
            ? [...currentValue, dateTimeValue]
            : [dateTimeValue];
          break;

        case "range":
          this.value.current = Array.isArray(currentValue) && currentValue.length === 1
            ? [...currentValue, dateTimeValue.endOf(granularity)]
            : [dateTimeValue.startOf(granularity)];
          break;
      }

      this.tmpValue.current = {};
    }

    switch (view) {
      case "year":
        this.setView("month");
        break;

      case "month":
        this.setView("day");
        break;

      case "day":
        this.setView("year");
        break;
    }
  }

  private setView(view: Period) {
    this.uiState.current = {
      ...this.uiState.current,
      view
    };
  }
}

