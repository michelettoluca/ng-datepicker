import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import { forwardRef, Provider, } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type OnChange<T> = (value: T) => void;
export type OnTouched = () => void;
export type OnValidatorChange = () => void;

export abstract class BaseValueAccessor<T = any> implements ControlValueAccessor, Validator {
  private _value!: T;

  get value() {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this._onChange(this._value);
  }

  public control?: AbstractControl;

  public get errors() {
    return this.control?.touched && this.control?.errors;
  }

  // --- Placeholder functions for ngModel
  private _onChange: OnChange<T> = (value) => {
  };
  onTouched: OnTouched = () => {
  };
  private _onValidatorChange: OnValidatorChange = () => {
  };


  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(onChange: OnChange<T>): void {
    this._onChange = onChange;
  }

  registerOnTouched(onTouched: OnTouched): void {
    this.onTouched = onTouched;
  }

  registerOnValidatorChange(onValidatorChange: OnValidatorChange): void {
    this._onValidatorChange = onValidatorChange;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.control != control) {
      this.control = control;
    }

    return null;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  // Utils
  public static makeProviders(component: Object): Provider[] {
    return [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => component),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => component),
        multi: true,
      }
    ];
  }
}
