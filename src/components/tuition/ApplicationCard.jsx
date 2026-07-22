// src/components/tuition/ApplicationCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const ApplicationCard = ({ application, onAccept, onReject, onComplete }) => {
  const isPending = application.status === 'pending';
  const statusColor =
    application.status === 'accepted'
      ? 'text-green-600'
      : application.status === 'rejected'
      ? 'text-red-600'
      : application.status === 'completed'
      ? 'text-blue-600'
      : 'text-yellow-600';

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{application.student_name}</h3>
          <p className="text-sm text-gray-500">
            Applied for: {application.subject} ({application.class_name})
          </p>
        </div>
        <span className={`text-sm font-medium capitalize ${statusColor}`}>
          {application.status}
        </span>
      </div>
      <p className="text-gray-700 text-sm">{application.message}</p>
      <p className="text-xs text-gray-400">
        Applied: {new Date(application.applied_at).toLocaleDateString()}
      </p>
      {isPending && (
        <div className="flex gap-2 mt-1">
          <Button onClick={() => onAccept(application.id)} className="text-sm bg-green-500 hover:bg-green-600">
            Accept
          </Button>
          <Button onClick={() => onReject(application.id)} className="text-sm bg-red-500 hover:bg-red-600">
            Reject
          </Button>
        </div>
      )}
      {application.status === 'accepted' && (
        <div className="flex gap-2 mt-1">
          <Button onClick={() => onComplete(application.id)} className="text-sm bg-blue-500 hover:bg-blue-600">
            Complete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;