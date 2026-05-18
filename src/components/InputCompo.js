import React, { useId } from 'react'

export default function InputCompo({
  label,
  placeholder,
  type = 'text',
  name,
  value,
  onChange,
  icon: Icon,
  helperText,
  error,
  id,
  required = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  const generatedId = useId()
  const inputId = id || name || generatedId
  const message = error || helperText
  const messageId = message ? `${inputId}-message` : undefined

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label className="mb-2 block text-sm font-bold text-[#10224a]" htmlFor={inputId}>
          {label}
          {required ? <span className="ml-1 text-[#18a84b]">*</span> : null}
        </label>
      ) : null}

      <div
        className={`group flex min-h-12 w-full items-center gap-3 rounded-lg border bg-white px-3 shadow-[0_8px_20px_rgba(12,35,80,0.06)] transition duration-200 ${
          error
            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100'
            : 'border-[#b8d5f0] hover:border-[#0c67d9] focus-within:border-[#18a84b] focus-within:ring-4 focus-within:ring-[#18a84b]/15'
        }`}
      >
        {Icon ? (
          <Icon
            className={`shrink-0 text-[16px] transition-colors duration-200 ${
              error ? 'text-red-500' : 'text-[#0c67d9] group-focus-within:text-[#18a84b]'
            }`}
            aria-hidden="true"
          />
        ) : null}

        <input
          aria-describedby={messageId}
          aria-invalid={error ? 'true' : undefined}
          className={`h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#10224a] outline-none placeholder:font-medium placeholder:text-[#7c8aa8] sm:text-[15px] ${inputClassName}`}
          id={inputId}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          {...props}
        />
      </div>

      {message ? (
        <p
          className={`mt-2 text-xs font-semibold ${error ? 'text-red-500' : 'text-[#587093]'}`}
          id={messageId}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
