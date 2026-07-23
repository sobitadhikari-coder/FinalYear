// src/components/tuition/TuitionCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const TuitionCard = ({ tuition, onDetails, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col gap-4">
      {/* Header: subject & class */}
      <div>
        <h3 className="text-lg font-bold text-gray-800">{tuition.subject}</h3>
        <p className="text-sm text-gray-500 font-medium">{tuition.class_name}</p>
      </div>

      {/* Price & hours badges */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rs. {tuition.price_per_month}/mo
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tuition.hours} hrs/day
        </span>
      </div>

      {/* Teacher name */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {tuition.teacher?.charAt(0).toUpperCase() || '?'}
        </div>
        <span>{tuition.teacher}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onDetails && (
          <Button onClick={() => onDetails(tuition.id)} size="sm">
            Details
          </Button>
        )}
        {onEdit && (
          <Button onClick={() => onEdit(tuition.id)} size="sm" className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-200">
            Edit
          </Button>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(tuition.id)} size="sm" className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-200">
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TuitionCard;