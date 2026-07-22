// src/pages/TuitionDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getTuitionDetail, applyForTuition } from '../api/tuition';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const TuitionDetailPage = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      if (role !== 'student') {
        navigate(ROUTES.TEACHER_TUITIONS, { replace: true });
        return;
      }
      try {
        const data = await getTuitionDetail(id);
        if (!cancelled) {
          setTuition(data);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            // Already applied – backend hides the tuition from the student
            setApplied(true);
          } else {
            setError('Failed to load tuition details.');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [id, role, navigate]);

  const handleApply = async () => {
    setApplySuccess('');
    setError('');
    setApplying(true);
    try {
      await applyForTuition(id, message);
      setApplySuccess('Application submitted successfully!');
      setApplied(true);
    } catch (err) {
      const data = err.response?.data;
      const errorMessage =
        data?.message || data?.detail || 'Failed to apply. Please try again.';
      setError(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading tuition details...</div>;
  }

  // 404 / already applied – show locked message without tuition details
  if (applied && !tuition) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-6 pt-16 text-center">
        <Card>
          <p className="text-gray-500">You have already applied for this tuition.</p>
        </Card>
      </div>
    );
  }

  // Other errors
  if (!tuition) {
    return <div className="text-center py-10 text-red-500">{error || 'Tuition not found.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pt-16">
      <h1 className="text-2xl font-bold">Tuition Details</h1>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="font-medium text-gray-600">Subject:</span>
            <p className="text-gray-800">{tuition.subject}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Class:</span>
            <p className="text-gray-800">{tuition.class_name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Price per Month:</span>
            <p className="text-gray-800">Rs. {tuition.price_per_month}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Hours per Day:</span>
            <p className="text-gray-800">{tuition.hours}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Teacher:</span>
            <p className="text-gray-800">{tuition.teacher}</p>
          </div>
        </div>
      </Card>

      <Card>
        {applied ? (
          <div className="text-center">
            {applySuccess && (
              <p className="text-green-600 font-semibold">{applySuccess}</p>
            )}
            <p className="text-gray-500 mt-2">You have already applied for this tuition.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Apply for this Tuition</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              rows="3"
              placeholder="Write a message to the teacher..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {applySuccess && <p className="text-green-600 text-sm mb-2">{applySuccess}</p>}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button onClick={handleApply} disabled={applying || !message.trim()}>
              {applying ? 'Applying...' : 'Apply'}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default TuitionDetailPage;