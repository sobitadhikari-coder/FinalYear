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
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tuition details...</p>
        </div>
      </div>
    );
  }

  // 404 / already applied – show locked message without tuition details
  if (applied && !tuition) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-xl border-0">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold text-lg">Already Applied</p>
          <p className="text-gray-500 mt-1">You have already applied for this tuition.</p>
        </Card>
      </div>
    );
  }

  // Other errors
  if (!tuition) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center text-red-500 font-medium">{error || 'Tuition not found.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 pt-24 space-y-6">
        {/* Page header */}
        <h1 className="text-3xl font-extrabold text-gray-900">Tuition Details</h1>

        {/* Tuition info card */}
        <Card className="shadow-xl border-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Subject</label>
              <p className="mt-1 text-gray-800 text-lg font-medium">{tuition.subject}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Class</label>
              <p className="mt-1 text-gray-800 text-lg font-medium">{tuition.class_name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Price per Month</label>
              <p className="mt-1 text-gray-800 text-lg font-medium">Rs. {tuition.price_per_month}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hours per Day</label>
              <p className="mt-1 text-gray-800 text-lg font-medium">{tuition.hours}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Teacher</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                  {tuition.teacher?.charAt(0).toUpperCase() || '?'}
                </div>
                <p className="text-gray-800 text-lg font-medium">{tuition.teacher}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Apply section */}
        <Card className="shadow-xl border-0">
          {applied ? (
            <div className="text-center py-2">
              {applySuccess && (
                <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-4 rounded-2xl mb-4 border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {applySuccess}
                </div>
              )}
              <p className="text-gray-500">You have already applied for this tuition.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Apply for this Tuition</h2>
              <p className="text-gray-500 text-sm mb-4">Write a message to the teacher explaining why you're interested.</p>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100
                           hover:border-gray-300 transition-all duration-200 ease-in-out resize-none"
                rows="4"
                placeholder="Write a message to the teacher..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {applySuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-xl mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {applySuccess}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              <div className="mt-5">
                <Button onClick={handleApply} disabled={applying || !message.trim()} size="lg">
                  {applying ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TuitionDetailPage;