// src/components/common/Card.jsx

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 
        shadow-md hover:shadow-lg
        p-6 
        transition-shadow duration-300 ease-in-out
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

export default Card;