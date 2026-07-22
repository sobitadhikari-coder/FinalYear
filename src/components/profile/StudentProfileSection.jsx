// src/components/profile/StudentProfileSection.jsx

const StudentProfileSection = ({ studentProfile, onUpdate }) => {
  if (!studentProfile) return null;

  return (
    <div className="bg-white p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Student Profile</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="font-medium text-gray-600">Grade:</span>
          <p className="text-gray-800">{studentProfile.grade || '—'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Interested Subjects:</span>
          <p className="text-gray-800">{studentProfile.interested_subjects || '—'}</p>
        </div>
      </div>

      {onUpdate && (
        <button
          onClick={onUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Update Student
        </button>
      )}
    </div>
  );
};

export default StudentProfileSection;