// src/pages/TeacherTuitionsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getMyTuitions,
  createTuition,
  updateTuition,
  deleteTuition,
} from '../api/tuition';
import { getTeacherProfile } from '../api/profile';
import TuitionCard from '../components/tuition/TuitionCard';
import TuitionForm from '../components/tuition/TuitionForm';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

const TeacherTuitionsPage = () => {
  const { role, isVerified } = useAuth();
  const navigate = useNavigate();
  const [tuitions, setTuitions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTuition, setEditingTuition] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (role !== 'teacher' || !isVerified) {
        navigate(ROUTES.PROFILE, { replace: true });
        return;
      }

      try {
        const [tuitionsData, teacherData] = await Promise.all([
          getMyTuitions(),
          getTeacherProfile(),
        ]);
        if (!cancelled) {
          setTuitions(tuitionsData);
          const names = teacherData.subject_details
            ? teacherData.subject_details.map((s) => s.name)
            : teacherData.subjects || [];
          setSubjects(names);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [role, isVerified, navigate]);

  const refreshTuitions = async () => {
    try {
      const data = await getMyTuitions();
      setTuitions(data);
      setError('');
    } catch {
      setError('Failed to load tuitions.');
    }
  };

  const handleCreate = async (data) => {
    await createTuition(data);
    setShowCreateForm(false);
    refreshTuitions();
  };

  const handleEdit = (id) => {
    const tuition = tuitions.find((t) => t.id === id);
    if (tuition) {
      setEditingTuition(tuition);
    }
  };

  const handleUpdate = async (data) => {
    if (!editingTuition) return;
    await updateTuition(editingTuition.id, data);
    setEditingTuition(null);
    refreshTuitions();
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTuition(deletingId);
      setDeletingId(null);
      refreshTuitions();
    } catch {
      setError('Delete failed.');
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Tuitions</h1>
            <p className="text-gray-500 mt-1">Create and manage your tuition listings.</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} size="lg">
            Create Tuition
          </Button>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 font-medium">No tuitions created yet</p>
            <p className="text-gray-400 text-sm mt-1">Click &ldquo;Create Tuition&rdquo; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tuitions.map((tuition) => (
              <TuitionCard
                key={tuition.id}
                tuition={tuition}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}

        {/* Create form modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowCreateForm(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TuitionForm onSubmit={handleCreate} subjects={subjects} />
            </div>
          </div>
        )}

        {/* Edit form modal */}
        {editingTuition && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setEditingTuition(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TuitionForm
                initialData={editingTuition}
                onSubmit={handleUpdate}
                subjects={subjects}
              />
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Tuition</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete this tuition? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setDeletingId(null)} className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-200">
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-200">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTuitionsPage;