// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-600 mb-4">Page not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;