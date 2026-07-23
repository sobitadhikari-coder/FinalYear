// src/components/common/Input.jsx

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className={`
          px-4 py-2.5 rounded-xl border-2 bg-gray-50
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200 ease-in-out
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'}
        `.trim().replace(/\s+/g, ' ')}
      />
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-500 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;