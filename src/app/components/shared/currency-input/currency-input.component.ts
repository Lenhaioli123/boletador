import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true
    }
  ]
})
export class CurrencyInputComponent implements ControlValueAccessor {
  @Input() id!: string;
  @Input() placeholder: string = '0,00';
  @Input() currencySymbol: string = '';
  @Input() className: string = '';
  @Input() disabled: boolean = false;

  value: number = 0;
  displayValue: string = '';

  private onChange = (value: number) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let rawValue = target.value.replace(/[^\d,.]/g, '');
    
    rawValue = rawValue.replace(',', '.');
    
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    const numValue = parseFloat(rawValue);
    
    if (!isNaN(numValue)) {
      const roundedValue = Math.round(numValue * 100) / 100;
      this.setValue(roundedValue);
    } else if (rawValue === '' || rawValue === '.' || rawValue === ',') {
      this.setValue(0);
    }
  }

  private setValue(value: number): void {
    this.value = value;
    this.displayValue = value ? value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      useGrouping: true 
    }) : '';
    this.onChange(value);
  }

  writeValue(value: number): void {
    this.value = value || 0;
    this.displayValue = this.value ? this.value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      useGrouping: true 
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