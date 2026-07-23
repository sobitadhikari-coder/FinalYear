// src/components/groups/GroupCard.jsx

import Button from '../common/Button';
import Card from '../common/Card';

const GroupCard = ({ group, onOpen }) => {
  return (
    <Card className="flex flex-col gap-4">
      {/* Header: group name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
            {group.subject?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-1">{group.name}</h3>
            <p className="text-sm text-gray-500">
              {group.subject} &middot; {group.class_name}
            </p>
          </div>
        </div>
      </div>

      {/* Teacher info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {group.teacher?.charAt(0).toUpperCase() || '?'}
        </div>
        <span>{group.teacher}</span>
      </div>

      {/* Members count */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>{group.members_count} member{group.members_count !== 1 ? 's' : ''}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Action button */}
      <Button onClick={() => onOpen(group.id)} size="sm" className="w-full sm:w-auto">
        Open
      </Button>
    </Card>
  );
};

export default GroupCard;