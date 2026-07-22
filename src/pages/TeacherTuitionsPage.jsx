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
          // Extract subject names from teacher profile
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
    return <div className="text-center py-10 pt-16">Loading tuitions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tuitions</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Tuition</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowCreateForm(false)}
            >
              ✕
            </button>
            <TuitionForm onSubmit={handleCreate} subjects={subjects} />
          </div>
        </div>
      )}

      {editingTuition && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setEditingTuition(null)}
            >
              ✕
            </button>
            <TuitionForm
              initialData={editingTuition}
              onSubmit={handleUpdate}
              subjects={subjects}
            />
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this tuition?</p>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setDeletingId(null)} className="bg-gray-500 hover:bg-gray-600">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {tuitions.length === 0 ? (
        <p className="text-gray-500 text-center">No tuitions created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default TeacherTuitionsPage;