import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validator
} from "@angular/forms";
import { Directive, EventEmitter, forwardRef, Input, Output, Provider, } from "@angular/core";

export type OnChange<T> = (value: T | null) => void;
export type OnTouched = () => void;
export type OnValidatorChange = () => void;

@Directive()
export abstract class BaseValueAccessor<T> implements ControlValueAccessor, Validator {
    private _value!: T;

    public get value() {
        return this._value;
    }

    @Input() public set value(value: T) {
        if(this._value === value) {
            return;
        }

        this._value = value;
        this.valueChange.emit(this._value)
        this._onChange(this._value);
    }

    @Output() public valueChange: EventEmitter<T> = new EventEmitter<T>()

    public control?: AbstractControl;

    public get errors() {
        return this.control?.touched && this.control?.errors;
    }

    public onTouched: OnTouched = () => {
    }

    public writeValue(value: T) {
        this.value = value;
    }

    public registerOnChange(onChange: OnChange<T>) {
        this._onChange = onChange;
    }

    public registerOnTouched(onTouched: OnTouched) {
        this.onTouched = onTouched;
    }

    public registerOnValidatorChange(onValidatorChange: OnValidatorChange) {
        this._onValidatorChange = onValidatorChange;
    }

    public validate(control: AbstractControl) {
        if (this.control != control) {
            this.control = control;
        }

        return control.errors;
    }

    public setDisabledState?(isDisabled: boolean) {
        throw new Error("Method not implemented.");
    }

    // Placeholder functions for ControlValueAccessor
    private _onChange: OnChange<T> = () => {
    }
    private _onValidatorChange: OnValidatorChange = () => {
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
