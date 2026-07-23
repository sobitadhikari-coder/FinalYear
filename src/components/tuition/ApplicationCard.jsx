// src/components/tuition/ApplicationCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const ApplicationCard = ({ application, onAccept, onReject, onComplete }) => {
  const isPending = application.status === 'pending';
  const statusColor =
    application.status === 'accepted'
      ? 'bg-green-50 text-green-700 border-green-200'
      : application.status === 'rejected'
      ? 'bg-red-50 text-red-700 border-red-200'
      : application.status === 'completed'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-yellow-50 text-yellow-700 border-yellow-200'; // pending

  return (
    <Card className="flex flex-col gap-4">
      {/* Header: student name + status */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
            {application.student_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{application.student_name}</h3>
            <p className="text-sm text-gray-500">
              {application.subject} &middot; {application.class_name}
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

      {/* Date */}
      <p className="text-xs text-gray-400">
        Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {isPending && (
          <>
            <Button onClick={() => onAccept(application.id)} size="sm" className="bg-green-500 hover:bg-green-600 active:bg-green-700 focus:ring-green-200">
              Accept
            </Button>
            <Button onClick={() => onReject(application.id)} size="sm" className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-200">
              Reject
            </Button>
          </>
        )}
        {application.status === 'accepted' && (
          <Button onClick={() => onComplete(application.id)} size="sm" className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-200">
            Complete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ApplicationCard;