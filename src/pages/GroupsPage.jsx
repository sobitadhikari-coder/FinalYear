// src/pages/GroupsPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyGroups, getGroupMessages, getVideoRoomLink } from '../api/groups';
import { getAccessToken } from '../utils/token';
import { API_BASE_URL, ROUTES } from '../utils/constants';
import MessageList from '../components/groups/MessageList';
import MessageInput from '../components/groups/MessageInput';
import VideoRoomLink from '../components/groups/VideoRoomLink';

const GroupsPage = () => {
  const { id: paramId } = useParams();
  const { user, role, isVerified } = useAuth();
  const navigate = useNavigate();

  // Initial selected group from URL – component remounts when paramId changes
  const [selectedGroupId, setSelectedGroupId] = useState(() =>
    paramId ? Number(paramId) : null
  );
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [videoRoomLink, setVideoRoomLinkState] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(() => !!paramId);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isAllowed = role === 'student' || (role === 'teacher' && isVerified);

  // ========== Load groups ==========
  useEffect(() => {
    if (!isAllowed) {
      navigate(ROUTES.PROFILE, { replace: true });
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getMyGroups();
        if (!cancelled) {
          setGroups(data);
          if (data.length > 0 && !selectedGroupId) {
            setSelectedGroupId(data[0].id);
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load groups.');
      } finally {
        if (!cancelled) setLoadingGroups(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllowed, navigate]);

  // ========== Load chat ==========
  useEffect(() => {
    if (!selectedGroupId) return;
    let cancelled = false;
    const load = async () => {
      setLoadingChat(true);
      setMessages([]);
      try {
        const [messagesData, videoData] = await Promise.all([
          getGroupMessages(selectedGroupId),
          getVideoRoomLink(selectedGroupId),
        ]);
        if (!cancelled) {
          setMessages(messagesData);
          setVideoRoomLinkState(videoData);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Failed to load chat.');
      } finally {
        if (!cancelled) setLoadingChat(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedGroupId]);

  // ========== WebSocket ==========
  useEffect(() => {
    if (!selectedGroupId) return;
    const token = getAccessToken();
    if (!token) return;
    const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const wsBase = API_BASE_URL.replace(/^https?/, wsProtocol);
    const wsUrl = `${wsBase}/ws/group-chat/${selectedGroupId}/?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    socket.onopen = () => console.log('WS connected');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender_username: data.sender,
        message: data.message,
        created_at: data.created_at,
      }]);
    };
    socket.onerror = (e) => console.error('WS error', e);
    socket.onclose = () => console.log('WS closed');
    return () => socket.close();
  }, [selectedGroupId]);

  // ========== Auto‑scroll ==========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ========== Handlers ==========
  const handleSend = (text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: text }));
    }
  };

  const handleBackToList = () => setShowChat(false);

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  if (loadingGroups) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh pt-16 flex bg-white">
      {/* Sidebar */}
      <div className={`${showChat ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-gray-50`}>
        <div className="p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.length === 0 ? (
            <p className="text-center text-gray-400 py-8 px-4">No groups found.</p>
          ) : (
            filteredGroups.map((group) => {
              const isActive = group.id === selectedGroupId;
              return (
                <button
                  key={group.id}
                  onClick={() => { setSelectedGroupId(group.id); setShowChat(true); }}
                  className={`w-full text-left p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200">
                    {group.subject?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-sm text-gray-800 truncate">{group.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{group.subject} &middot; {group.class_name}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className={`${showChat ? 'flex' : 'hidden'} sm:flex flex-1 flex-col`}>
        {selectedGroup ? (
          <>
            <div className="flex-none bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <button className="sm:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors mr-1" onClick={handleBackToList}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200">
                {selectedGroup.subject?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-800 truncate">{selectedGroup.name}</h2>
                <p className="text-xs text-gray-500">{selectedGroup.subject} &middot; {selectedGroup.class_name}</p>
              </div>
              <VideoRoomLink videoRoomLink={videoRoomLink} />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading messages...</div>
              ) : (
                <MessageList messages={messages} currentUsername={user?.username} />
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex-none bg-white border-t border-gray-200 px-4 py-3">
              <MessageInput onSend={handleSend} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">No conversation selected</p>
              <p className="text-sm mt-1">Choose a group from the left to start chatting.</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 shadow-lg max-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;