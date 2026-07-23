// src/components/profile/TeacherProfileSection.jsx

import CVUpload from './CVUpload';

const TeacherProfileSection = ({ teacherProfile, isVerified, onUpdate, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-center">
        <p className="font-medium">Failed to load teacher profile</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!teacherProfile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 text-center text-gray-500">
        Loading teacher profile...
      </div>
    );
  }

  const subjectNames = teacherProfile.subject_details
    ? teacherProfile.subject_details.map((s) => s.name)
    : teacherProfile.subjects || [];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Header with background */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
              {teacherProfile.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{teacherProfile.username}</h2>
              <p className="text-blue-100 text-sm">{teacherProfile.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {isVerified ? 'Verified' : 'Awaiting verification'}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bio</label>
            <p className="mt-1 text-gray-800">{teacherProfile.bio || '—'}</p>
          </div>

          {/* Subjects */}
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Subjects</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {subjectNames.length > 0 ? (
                subjectNames.map((name) => (
                  <span key={name} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    {name}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No subjects added</p>
              )}
            </div>
          </div>

          {/* Action button */}
          {onUpdate && (
            <div className="pt-2">
              <button
                onClick={onUpdate}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                Update Teacher
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CV Upload (only if not verified) */}
      {!isVerified && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Verification</h3>
          <p className="text-sm text-gray-500 mb-4">Upload your CV to get verified by an administrator.</p>
          <CVUpload />
        </div>
      )}
    </div>
  );
};

export default TeacherProfileSection;