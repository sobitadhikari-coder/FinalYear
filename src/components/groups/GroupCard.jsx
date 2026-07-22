// src/components/groups/GroupCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const GroupCard = ({ group, onOpen }) => {
  return (
    <Card className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{group.name}</h3>
      <p className="text-sm text-gray-600">
        Subject: <span className="font-medium">{group.subject}</span> | Class: <span className="font-medium">{group.class_name}</span>
      </p>
      <p className="text-sm text-gray-600">
        Teacher: <span className="font-medium">{group.teacher}</span>
      </p>
      <p className="text-sm text-gray-600">
        Members: <span className="font-medium">{group.members_count}</span>
      </p>
      <Button onClick={() => onOpen(group.id)} className="mt-2">
        Open
      </Button>
    </Card>
  );
};

export default GroupCard;