import { ChangeEvent } from 'react';

interface CurrencyInputProps {
  id: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  currencySymbol?: string;
  className?: string;
  disabled?: boolean;
}

const CurrencyInput = ({
  id,
  value,
  onChange,
  placeholder = '0,00',
  currencySymbol = '',
  className = '',
  disabled = false
}: CurrencyInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except comma and period
    let rawValue = e.target.value.replace(/[^\d,.]/g, '');
    
    // Replace comma with period for calculation
    rawValue = rawValue.replace(',', '.');
    
    // Ensure only one decimal separator
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Convert to number
    const numValue = parseFloat(rawValue);
    
    if (!isNaN(numValue)) {
      // Limit to 2 decimal places
      const roundedValue = Math.round(numValue * 100) / 100;
      onChange(roundedValue);
    } else if (rawValue === '' || rawValue === '.' || rawValue === ',') {
      onChange(0);
    }
  };

  const formattedValue = value
    ? typeof value === 'number'
      ? value.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2,
          useGrouping: true 
        })
      : value
    : '';

  return (
    <div className="relative">
      {currencySymbol && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
        </div>
      )}
      <input
        id={id}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-input ${currencySymbol ? 'pl-7' : ''} ${className}`}
        disabled={disabled}
      />
    </div>
  );
};

export default CurrencyInput;