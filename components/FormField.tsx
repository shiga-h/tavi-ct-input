'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { TaviFormData } from '@/types/form';

interface FormFieldProps {
  label: string;
  name: keyof TaviFormData;
  register: UseFormRegister<TaviFormData>;
  error?: FieldError;
  warning?: string | null;
  type?: 'text' | 'number';
  placeholder?: string;
  step?: string;
  onFieldChange?: () => void;
  onFieldFocus?: (fieldName: keyof TaviFormData) => void;
  onFieldBlur?: () => void;
  onFieldKeyDown?: (fieldName: keyof TaviFormData, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function FormField({
  label,
  name,
  register,
  error,
  warning,
  type = 'text',
  placeholder,
  step,
  onFieldChange,
  onFieldFocus,
  onFieldBlur,
  onFieldKeyDown,
}: FormFieldProps) {
  const registration = register(name);
  const { onChange: originalOnChange, onFocus: originalOnFocus, onBlur: originalOnBlur, onKeyDown: originalOnKeyDown, ...rest } = registration;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // react-hook-formのonChangeを呼び出す
    originalOnChange({
      target: e.target,
      type: e.type,
    });
    // 自動保存用のコールバックを呼び出す
    onFieldChange?.();
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // react-hook-formのonFocusを呼び出す
    originalOnFocus?.(e);
    // フォーカス状態を親に通知
    onFieldFocus?.(name);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // react-hook-formのonBlurを呼び出す
    originalOnBlur?.(e);
    // フォーカス解除を親に通知
    onFieldBlur?.();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // react-hook-formのonKeyDownを呼び出す
    originalOnKeyDown?.(e);
    // Enterキーで次のフィールドに移動
    onFieldKeyDown?.(name, e);
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        step={step || (type === 'number' ? '0.1' : undefined)}
        {...rest}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-2 py-1.5 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
          error ? 'border-red-500' : warning ? 'border-yellow-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
      {warning && !error && (
        <p className="mt-1 text-sm text-yellow-600">{warning}</p>
      )}
    </div>
  );
}

