// src/pages/GroupDetailPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getGroupDetail,
  getGroupMessages,
  getVideoRoomLink,
} from '../api/groups';
import { getAccessToken } from '../utils/token';
import { API_BASE_URL, ROUTES } from '../utils/constants';
import MessageList from '../components/groups/MessageList';
import MessageInput from '../components/groups/MessageInput';
import VideoRoomLink from '../components/groups/VideoRoomLink';

const GroupDetailPage = () => {
  const { id } = useParams();
  const { user, role, isVerified } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [videoRoomLink, setVideoRoomLinkState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (role !== 'student' && !(role === 'teacher' && isVerified)) {
        navigate(ROUTES.PROFILE, { replace: true });
        return;
      }
      try {
        const [groupData, messagesData, videoData] = await Promise.all([
          getGroupDetail(id),
          getGroupMessages(id),
          getVideoRoomLink(id),
        ]);
        if (!cancelled) {
          setGroup(groupData);
          setMessages(messagesData);
          setVideoRoomLinkState(videoData);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load group data.');
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
  }, [id, role, isVerified, navigate]);

  useEffect(() => {
    if (!group) return;

    const token = getAccessToken();
    if (!token) return;

    const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const wsBase = API_BASE_URL.replace(/^https?/, wsProtocol);
    const wsUrl = `${wsBase}/ws/group-chat/${id}/?token=${token}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_username: data.sender,
          sender_role: data.sender_role,
          message: data.message,
          created_at: data.created_at,
        },
      ]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [id, group]);

  const handleSend = (message) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading group...</div>;
  }

  if (!group) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || 'Group not found.'}
      </div>
    );
  }

  return (
    <div className="pt-16 h-dvh flex flex-col">
      {/* Fixed header (inside the group page, not the global navbar) */}
      <div className="flex-none border-b p-4 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-lg font-bold">{group.name}</h1>
          <p className="text-sm text-gray-500">
            {group.subject} &middot; {group.class_name} &middot; {group.teacher}
          </p>
        </div>
        <VideoRoomLink videoRoomLink={videoRoomLink} />
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <MessageList messages={messages} currentUsername={user?.username} />
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed footer input */}
      <div className="flex-none border-t p-4 bg-white">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default GroupDetailPage;