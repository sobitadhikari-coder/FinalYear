// src/components/tuition/ApplicationStatusCard.jsx

import Card from '../common/Card';

const ApplicationStatusCard = ({ application }) => {
  const statusColor =
    application.status === 'accepted'
      ? 'text-green-600'
      : application.status === 'rejected'
      ? 'text-red-600'
      : application.status === 'completed'
      ? 'text-blue-600'
      : 'text-yellow-600'; // pending

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{application.tuition_details?.subject || '—'}</h3>
          <p className="text-sm text-gray-500">
            {application.tuition_details?.class_name || '—'} &middot; Teacher: {application.tuition_details?.teacher || '—'}
          </p>
        </div>
        <span className={`text-sm font-medium capitalize ${statusColor}`}>
          {application.status}
        </span>
      </div>
      {application.message && (
        <p className="text-gray-700 text-sm italic">"{application.message}"</p>
      )}
    </Card>
  );
};

export default ApplicationStatusCard;