// src/components/profile/TeacherProfileSection.jsx

import CVUpload from './CVUpload';

const TeacherProfileSection = ({ teacherProfile, isVerified, onUpdate, error }) => {
  if (error) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm text-red-500">
        Failed to load teacher profile: {error}
      </div>
    );
  }

  if (!teacherProfile) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm text-gray-500">
        Loading teacher profile...
      </div>
    );
  }

  const subjectNames = teacherProfile.subject_details
    ? teacherProfile.subject_details.map((s) => s.name).join(', ')
    : teacherProfile.subjects?.join(', ') || '—';

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Teacher Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="font-medium text-gray-600">Bio:</span>
            <p className="text-gray-800">{teacherProfile.bio || '—'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Subjects:</span>
            <p className="text-gray-800">{subjectNames}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Verification Status:</span>
            <span className={`ml-1 font-semibold ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {isVerified ? 'Verified' : 'Awaiting verification'}
            </span>
          </div>
        </div>
        {onUpdate && (
          <button
            onClick={onUpdate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Update Teacher
          </button>
        )}
      </div>
      {!isVerified && <CVUpload />}
    </div>
  );
};

export default TeacherProfileSection;