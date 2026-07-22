// src/pages/GroupsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyGroups } from '../api/groups';
import GroupCard from '../components/groups/GroupCard';
import { ROUTES } from '../utils/constants';

const GroupsPage = () => {
  const { role, isVerified } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadGroups = async () => {
      // Student or verified teacher only
      const allowed = role === 'student' || (role === 'teacher' && isVerified);
      if (!allowed) {
        navigate(ROUTES.PROFILE, { replace: true });
        return;
      }
      try {
        const data = await getMyGroups();
        if (!cancelled) {
          setGroups(data);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load groups.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, [role, isVerified, navigate]);

  const handleOpen = (id) => {
    navigate(`${ROUTES.GROUP_DETAIL.replace(':id', id)}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading groups...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pt-16">
      <h1 className="text-2xl font-bold">My Groups</h1>
      {error && <p className="text-red-500">{error}</p>}
      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">You are not in any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onOpen={handleOpen} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;