// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getSharedProfile,
  getTeacherProfile,
  getStudentProfile,
  updateSharedProfile,
  updateTeacherProfile,
  updateStudentProfile,
} from '../api/profile';
import TeacherProfileSection from '../components/profile/TeacherProfileSection';
import StudentProfileSection from '../components/profile/StudentProfileSection';
import UserInfoSection from '../components/profile/UserInfoSection';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ProfilePage = () => {
  const { role, isVerified, updateUserState } = useAuth();

  const [sharedProfile, setSharedProfile] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [teacherError, setTeacherError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingUser, setEditingUser] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(false);
  const [editingStudent, setEditingStudent] = useState(false);

  const [formUser, setFormUser] = useState({
    username: '', email: '', phone_number: '', full_name: '',
  });
  const [formTeacher, setFormTeacher] = useState({
    bio: '', subjects: '',
  });
  const [formStudent, setFormStudent] = useState({
    grade: '', interested_subjects: '',
  });

  useEffect(() => {
    let cancelled = false;
    const loadProfiles = async () => {
      try {
        const shared = await getSharedProfile();
        if (cancelled) return;
        setSharedProfile(shared);
        updateUserState(shared);

        if (role === 'teacher') {
          try {
            const teacher = await getTeacherProfile();
            if (!cancelled) {
              setTeacherProfile(teacher);
              setTeacherError('');
            }
          } catch {
            if (!cancelled) setTeacherError('Failed to load teacher profile.');
          }
        } else if (role === 'student') {
          try {
            const student = await getStudentProfile();
            if (!cancelled) setStudentProfile(student);
          } catch { /* ignore */ }
        }
      } catch {
        if (!cancelled) setError('Failed to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfiles();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProfiles = async () => {
    try {
      const shared = await getSharedProfile();
      setSharedProfile(shared);
      updateUserState(shared);
      if (role === 'teacher') {
        try {
          const teacher = await getTeacherProfile();
          setTeacherProfile(teacher);
          setTeacherError('');
        } catch { setTeacherError('Failed to refresh teacher profile.'); }
      } else if (role === 'student') {
        const student = await getStudentProfile();
        setStudentProfile(student);
      }
    } catch { setError('Failed to refresh profile.'); }
  };

  const handleEditUser = () => {
    setFormUser({
      username: sharedProfile.username || '',
      email: sharedProfile.email || '',
      phone_number: sharedProfile.phone_number || '',
      full_name: sharedProfile.full_name || '',
    });
    setEditingUser(true);
  };

  const handleEditTeacher = () => {
    setFormTeacher({
      bio: teacherProfile?.bio || '',
      subjects: teacherProfile?.subject_details
        ? teacherProfile.subject_details.map((s) => s.name).join(', ')
        : teacherProfile?.subjects?.join(', ') || '',
    });
    setEditingTeacher(true);
  };

  const handleEditStudent = () => {
    setFormStudent({
      grade: studentProfile?.grade || '',
      interested_subjects: studentProfile?.interested_subjects || '',
    });
    setEditingStudent(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      await updateSharedProfile({
        id: sharedProfile.id,
        username: formUser.username,
        email: formUser.email,
        phone_number: formUser.phone_number,
        full_name: formUser.full_name,
      });
      setEditingUser(false);
      refreshProfiles();
    } catch { setError('Update failed.'); }
  };

  const handleSubmitTeacher = async (e) => {
    e.preventDefault();
    try {
      await updateTeacherProfile({
        bio: formTeacher.bio,
        subjects: formTeacher.subjects.split(',').map(s => s.trim()).filter(Boolean),
      });
      setEditingTeacher(false);
      refreshProfiles();
    } catch { setError('Update failed.'); }
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudentProfile({
        grade: formStudent.grade,
        interested_subjects: formStudent.interested_subjects,
      });
      setEditingStudent(false);
      refreshProfiles();
    } catch { setError('Update failed.'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading profile...</p>
      </div>
    </div>
  );

  if (!sharedProfile) return (
    <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
      <div className="text-center text-red-500 font-medium">{error || 'Profile not available.'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24 space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your personal information and role settings.</p>
          </div>
          {role === 'teacher' && isVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Verified Teacher
            </span>
          )}
        </div>

        {/* Role‑specific section */}
        {role === 'teacher' && (
          editingTeacher ? (
            <Card className="shadow-xl border-0">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Teacher Profile</h3>
              <form onSubmit={handleSubmitTeacher} className="flex flex-col gap-5">
                <Input label="Bio" value={formTeacher.bio} onChange={e => setFormTeacher({...formTeacher, bio: e.target.value})} />
                <Input label="Subjects (comma separated)" value={formTeacher.subjects} onChange={e => setFormTeacher({...formTeacher, subjects: e.target.value})} />
                <div className="flex gap-3">
                  <Button type="submit">Save</Button>
                  <Button type="button" onClick={() => setEditingTeacher(false)} className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-200">Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <TeacherProfileSection
              teacherProfile={teacherProfile}
              isVerified={isVerified}
              onUpdate={handleEditTeacher}
              error={teacherError}
            />
          )
        )}

        {role === 'student' && (
          editingStudent ? (
            <Card className="shadow-xl border-0">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Student Profile</h3>
              <form onSubmit={handleSubmitStudent} className="flex flex-col gap-5">
                <Input label="Grade" value={formStudent.grade} onChange={e => setFormStudent({...formStudent, grade: e.target.value})} required />
                <Input label="Interested Subjects" value={formStudent.interested_subjects} onChange={e => setFormStudent({...formStudent, interested_subjects: e.target.value})} />
                <div className="flex gap-3">
                  <Button type="submit">Save</Button>
                  <Button type="button" onClick={() => setEditingStudent(false)} className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-200">Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <StudentProfileSection studentProfile={studentProfile} onUpdate={handleEditStudent} />
          )
        )}

        {/* General user info section */}
        {editingUser ? (
          <Card className="shadow-xl border-0">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Edit General Info</h3>
            <form onSubmit={handleSubmitUser} className="flex flex-col gap-5">
              <Input label="Username" value={formUser.username} onChange={e => setFormUser({...formUser, username: e.target.value})} required />
              <Input label="Email" type="email" value={formUser.email} onChange={e => setFormUser({...formUser, email: e.target.value})} required />
              <Input label="Phone Number" value={formUser.phone_number} onChange={e => setFormUser({...formUser, phone_number: e.target.value})} />
              <Input label="Full Name" value={formUser.full_name} onChange={e => setFormUser({...formUser, full_name: e.target.value})} />
              <div className="flex gap-3">
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => setEditingUser(false)} className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-200">Cancel</Button>
              </div>
            </form>
          </Card>
        ) : (
          <UserInfoSection user={sharedProfile} onUpdate={handleEditUser} />
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;