import { ChangeEvent } from 'react';

interface PercentageInputProps {
  id: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PercentageInput = ({
  id,
  value,
  onChange,
  placeholder = '0.00',
  className = '',
  disabled = false
}: PercentageInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(rawValue);
    
    if (!isNaN(numValue)) {
      onChange(numValue);
    } else if (rawValue === '' || rawValue === '.') {
      onChange(0);
    }
  };

  const formattedValue = value
    ? typeof value === 'number'
      ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : value
    : '';

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-input pr-7 ${className}`}
        disabled={disabled}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">%</span>
      </div>
    </div>
  );
};

export default PercentageInput;