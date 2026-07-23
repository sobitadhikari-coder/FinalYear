// src/components/tuition/ApplicationStatusCard.jsx

import Card from '../common/Card';

const ApplicationStatusCard = ({ application }) => {
  const statusColor =
    application.status === 'accepted'
      ? 'bg-green-50 text-green-700 border-green-200'
      : application.status === 'rejected'
      ? 'bg-red-50 text-red-700 border-red-200'
      : application.status === 'completed'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-yellow-50 text-yellow-700 border-yellow-200'; // pending

  const tuition = application.tuition_details || {};

  return (
    <Card className="flex flex-col gap-4">
      {/* Header: subject + status */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-200">
            {tuition.subject?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{tuition.subject || '—'}</h3>
            <p className="text-sm text-gray-500">
              {tuition.class_name || '—'} &middot; {tuition.teacher || '—'}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            application.status === 'accepted' ? 'bg-green-500' :
            application.status === 'rejected' ? 'bg-red-500' :
            application.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
          }`}></span>
          {application.status}
        </span>
      </div>

      {/* Message */}
      {application.message && (
        <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 italic border border-gray-100">
          &ldquo;{application.message}&rdquo;
        </div>
      )}

      {/* Price & hours badges */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rs. {tuition.price_per_month}/mo
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tuition.hours} hrs/day
        </span>
      </div>
    </Card>
  );
};

export default ApplicationStatusCard;