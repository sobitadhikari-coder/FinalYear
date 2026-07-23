// src/components/profile/StudentProfileSection.jsx

const StudentProfileSection = ({ studentProfile, onUpdate }) => {
  if (!studentProfile) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header with background */}
      <div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
            {studentProfile.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{studentProfile.username}</h2>
            <p className="text-purple-100 text-sm">{studentProfile.email}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Student
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-5">
        {/* Grade */}
        <div>
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Grade</label>
          <p className="mt-1 text-gray-800 text-lg font-medium">{studentProfile.grade || '—'}</p>
        </div>

        {/* Interested Subjects */}
        <div>
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Interested Subjects</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {studentProfile.interested_subjects ? (
              studentProfile.interested_subjects.split(',').map((s) => (
                <span key={s.trim()} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                  {s.trim()}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No subjects selected</p>
            )}
          </div>
        </div>

        {/* Action button */}
        {onUpdate && (
          <div className="pt-2">
            <button
              onClick={onUpdate}
              className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 active:bg-purple-800 transition-all shadow-sm hover:shadow-md"
            >
              Update Student
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileSection;