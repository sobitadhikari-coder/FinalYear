// src/components/tuition/TuitionCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const TuitionCard = ({ tuition, onDetails, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{tuition.subject}</h3>
          <p className="text-sm text-gray-500">{tuition.class_name}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">Rs. {tuition.price_per_month}/mo</p>
          <p className="text-sm text-gray-500">{tuition.hours} hrs/day</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Teacher: <span className="font-medium">{tuition.teacher}</span>
      </p>
      <div className="flex gap-2 mt-2">
        {onDetails && (
          <Button onClick={() => onDetails(tuition.id)} className="text-sm">
            Details
          </Button>
        )}
        {onEdit && (
          <Button onClick={() => onEdit(tuition.id)} className="text-sm bg-yellow-500 hover:bg-yellow-600">
            Edit
          </Button>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(tuition.id)} className="text-sm bg-red-500 hover:bg-red-600">
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TuitionCard;