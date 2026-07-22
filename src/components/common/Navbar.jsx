// src/components/common/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const { user, role, isVerified, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-blue-600 text-white p-4 flex flex-wrap items-center justify-between">
      <div className="flex gap-4">
        <Link to={ROUTES.PROFILE} className="hover:underline">Profile</Link>

        {role === 'teacher' && isVerified && (
          <>
            <Link to={ROUTES.TEACHER_TUITIONS} className="hover:underline">My Tuitions</Link>
            <Link to={ROUTES.TEACHER_APPLICATIONS} className="hover:underline">Applications</Link>
          </>
        )}

        {role === 'student' && (
          <>
            <Link to={ROUTES.STUDENT_TUITIONS} className="hover:underline">Available Tuitions</Link>
            <Link to={ROUTES.STUDENT_APPLICATIONS} className="hover:underline">My Applications</Link>
          </>
        )}

        {(role === 'student' || (role === 'teacher' && isVerified)) && (
          <Link to={ROUTES.GROUPS} className="hover:underline">My Groups</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user.username} ({role})</span>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;