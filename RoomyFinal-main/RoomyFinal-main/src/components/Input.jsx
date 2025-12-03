import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  error,
  helperText,
  icon,
  type = 'text',
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    icon ? 'input-with-icon' : '',
    fullWidth ? 'input-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    fullWidth ? 'input-container-full-width' : '',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && <p className="input-error-text">{error}</p>}
      {helperText && !error && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({ 
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props 
}) => {
  const textareaClasses = [
    'textarea',
    error ? 'textarea-error' : '',
    fullWidth ? 'textarea-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    fullWidth ? 'input-container-full-width' : '',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="input-label">{label}</label>}
      <textarea 
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && <p className="input-error-text">{error}</p>}
      {helperText && !error && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};

export const Select = ({ 
  label,
  error,
  helperText,
  options = [],
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const selectClasses = [
    'select',
    error ? 'select-error' : '',
    fullWidth ? 'select-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    fullWidth ? 'input-container-full-width' : '',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="input-label">{label}</label>}
      <select 
        className={selectClasses}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="input-error-text">{error}</p>}
      {helperText && !error && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};

export { Input };
export default Input;
