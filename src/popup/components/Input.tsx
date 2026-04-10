import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input className={`input-field ${className}`} {...props} />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <textarea className={`input-field ${className}`} {...props} />
    </div>
  );
}
