// src/components/common/Button.jsx

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  size = 'md',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        bg-blue-600 text-white
        hover:bg-blue-700 active:bg-blue-800
        disabled:bg-blue-300 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md active:shadow-inner
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-blue-200
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </button>
  );
};

export default Button;