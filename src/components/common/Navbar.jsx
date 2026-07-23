// src/components/common/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const { user, role, isVerified, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  if (!user) return null;

  // Common navigation links as a function so we can reuse them in desktop and mobile
  const navLinks = () => (
    <>
      <Link
        to={ROUTES.PROFILE}
        className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
        onClick={closeMenu}
      >
        Profile
      </Link>

      {role === 'teacher' && isVerified && (
        <>
          <Link
            to={ROUTES.TEACHER_TUITIONS}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
            onClick={closeMenu}
          >
            My Tuitions
          </Link>
          <Link
            to={ROUTES.TEACHER_APPLICATIONS}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
            onClick={closeMenu}
          >
            Applications
          </Link>
        </>
      )}

      {role === 'student' && (
        <>
          <Link
            to={ROUTES.STUDENT_TUITIONS}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
            onClick={closeMenu}
          >
            Available Tuitions
          </Link>
          <Link
            to={ROUTES.STUDENT_APPLICATIONS}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
            onClick={closeMenu}
          >
            My Applications
          </Link>
        </>
      )}

      {(role === 'student' || (role === 'teacher' && isVerified)) && (
        <Link
          to={ROUTES.GROUPS}
          className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors block"
          onClick={closeMenu}
        >
          My Groups
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-tight hover:scale-105 transition-transform">
          TMS
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks()}
        </div>

        {/* Desktop user info + logout */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{user.username}</span>
            <span className="text-xs text-blue-200 bg-white/20 px-2 py-0.5 rounded-full capitalize">
              {role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl transition-all shadow hover:shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-blue-800 bg-opacity-95 backdrop-blur-sm border-t border-white/10">
          <div className="flex flex-col p-4 space-y-1">
            {navLinks()}
            <hr className="border-white/20 my-2" />
            <div className="flex items-center gap-3 py-2">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs text-blue-200 bg-white/20 px-2 py-0.5 rounded-full capitalize">
                  {role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl transition-all shadow text-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;