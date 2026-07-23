// src/components/profile/UserInfoSection.jsx

const UserInfoSection = ({ user, onUpdate }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
            {user.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">General Information</h2>
            <p className="text-gray-300 text-sm">{user.full_name || 'Your account details'}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Username</label>
            <p className="mt-1 text-gray-800 font-medium">{user.username || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <p className="mt-1 text-gray-800 font-medium">{user.email || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
            <p className="mt-1 text-gray-800 font-medium">{user.phone_number || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
            <p className="mt-1 text-gray-800 font-medium">{user.full_name || '—'}</p>
          </div>
        </div>

        {/* Action button */}
        {onUpdate && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onUpdate}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-all shadow-sm hover:shadow-md"
            >
              Update User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoSection;