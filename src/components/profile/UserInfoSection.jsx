// src/components/profile/UserInfoSection.jsx

const UserInfoSection = ({ user, onUpdate }) => {
  if (!user) return null;

  return (
    <div className="bg-white p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-3">General Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="font-medium text-gray-600">Username:</span>
          <p className="text-gray-800">{user.username || '—'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Email:</span>
          <p className="text-gray-800">{user.email || '—'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Phone Number:</span>
          <p className="text-gray-800">{user.phone_number || '—'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Full Name:</span>
          <p className="text-gray-800">{user.full_name || '—'}</p>
        </div>
      </div>

      {onUpdate && (
        <button
          onClick={onUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Update User
        </button>
      )}
    </div>
  );
};

export default UserInfoSection;