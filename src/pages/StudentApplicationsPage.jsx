// src/pages/StudentApplicationsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyApplications } from '../api/tuition';
import ApplicationStatusCard from '../components/tuition/ApplicationStatusCard';
import { ROUTES } from '../utils/constants';

const StudentApplicationsPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'student') {
      navigate(ROUTES.TEACHER_TUITIONS, { replace: true });
      return;
    }

    let cancelled = false;

    const loadApplications = async () => {
      try {
        const data = await getMyApplications();
        if (!cancelled) {
          setApplications(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load your applications.');
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
  }, [role, navigate]);

  if (loading) {
    return <div className="text-center py-10 pt-16">Loading applications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 pt-16">
      <h1 className="text-2xl font-bold">My Applications</h1>
      {error && <p className="text-red-500">{error}</p>}
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <ApplicationStatusCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;