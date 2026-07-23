// src/pages/StudentTuitionsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAvailableTuitions } from '../api/tuition';
import TuitionCard from '../components/tuition/TuitionCard';
import { ROUTES } from '../utils/constants';

const StudentTuitionsPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadTuitions = async () => {
      if (role !== 'student') {
        navigate(ROUTES.TEACHER_TUITIONS, { replace: true });
        return;
      }
      try {
        const data = await getAvailableTuitions();
        if (!cancelled) {
          setTuitions(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load available tuitions.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTuitions();

    return () => {
      cancelled = true;
    };
  }, [role, navigate]);

  const handleDetails = (id) => {
    navigate(`${ROUTES.TUITION_DETAIL.replace(':id', id)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tuitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Available Tuitions</h1>
          <p className="text-gray-500 mt-1">Browse and apply for tuitions that match your interests.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Tuition list */}
        {tuitions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No tuitions available at the moment</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tuitions.map((tuition) => (
              <TuitionCard
                key={tuition.id}
                tuition={tuition}
                onDetails={handleDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTuitionsPage;