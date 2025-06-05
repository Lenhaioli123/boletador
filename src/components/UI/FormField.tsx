import { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  helpText?: string;
}

const FormField = ({ id, label, children, className = '', required = false, helpText }: FormFieldProps) => {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;