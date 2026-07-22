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
    return <div className="text-center py-10 pt-16">Loading tuitions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pt-16">
      <h1 className="text-2xl font-bold">Available Tuitions</h1>
      {error && <p className="text-red-500">{error}</p>}
      {tuitions.length === 0 ? (
        <p className="text-gray-500 text-center">No tuitions available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};

export default StudentTuitionsPage;