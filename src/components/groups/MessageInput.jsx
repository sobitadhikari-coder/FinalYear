// src/components/groups/MessageInput.jsx

import { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Aa"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
        disabled={!message.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;