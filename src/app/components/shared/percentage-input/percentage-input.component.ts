import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-percentage-input',
  templateUrl: './percentage-input.component.html',
  styleUrls: ['./percentage-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageInputComponent),
      multi: true
    }
  ]
})
export class PercentageInputComponent implements ControlValueAccessor {
  @Input() id!: string;
  @Input() placeholder: string = '0.00';
  @Input() className: string = '';
  @Input() disabled: boolean = false;

  value: number = 0;
  displayValue: string = '';

  private onChange = (value: number) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(rawValue);
    
    if (!isNaN(numValue)) {
      this.setValue(numValue);
    } else if (rawValue === '' || rawValue === '.') {
      this.setValue(0);
    }
  }

  private setValue(value: number): void {
    this.value = value;
    this.displayValue = value ? value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) : '';
    this.onChange(value);
  }

  writeValue(value: number): void {
    this.value = value || 0;
    this.displayValue = this.value ? this.value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) : '';
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}