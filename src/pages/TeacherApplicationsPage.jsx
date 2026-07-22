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
      // response.data contains updated application
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
    return <div className="text-center py-10 pt-16">Loading applications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 pt-16">
      <h1 className="text-2xl font-bold">Applications</h1>
      {error && <p className="text-red-500">{error}</p>}
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};

export default TeacherApplicationsPage;