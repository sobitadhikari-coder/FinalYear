// src/pages/TeacherApplicationsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getApplications,
  acceptApplication,
  rejectApplication,
  completeApplication,
} from '../api/tuition';
import ApplicationCard from '../components/tuition/ApplicationCard';
import { ROUTES } from '../utils/constants';

const TeacherApplicationsPage = () => {
  const { role, isVerified } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      if (role !== 'teacher' || !isVerified) {
        navigate(ROUTES.PROFILE, { replace: true });
        return;
      }
      try {
        const data = await getApplications();
        if (!cancelled) {
          setApplications(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load applications.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [role, isVerified, navigate]);

  const handleAccept = async (id) => {
    try {
      const response = await acceptApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? response.data : app))
      );
    } catch {
      setError('Failed to accept application.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? response.data : app))
      );
    } catch {
      setError('Failed to reject application.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await completeApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? response.data : app))
      );
    } catch {
      setError('Failed to complete application.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">Review and manage student applications for your tuitions.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Application list */}
        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Student applications will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherApplicationsPage;