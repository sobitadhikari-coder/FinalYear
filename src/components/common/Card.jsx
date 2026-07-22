// src/components/common/Card.jsx

const Card = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border border-gray-200 rounded-lg shadow-sm bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card;