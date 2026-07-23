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
    <form onSubmit={handleSubmit} className="flex items-end gap-3 mt-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 bg-gray-50 
                     text-sm text-gray-800 placeholder-gray-400
                     focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100
                     hover:border-gray-300 transition-all duration-200 ease-in-out"
        />
        {/* Subtle send icon inside the input (optional, but adds style) */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-blue-600 text-white 
                     hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;