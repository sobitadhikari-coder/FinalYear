// src/components/groups/MessageList.jsx

const MessageList = ({ messages, currentUsername }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-gray-400 text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No messages yet</p>
        <p className="text-xs text-gray-300 mt-1">Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {messages.map((msg) => {
        const isMine = msg.sender_username === currentUsername;
        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%] gap-2.5`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isMine
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}>
                {msg.sender_username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                {/* Sender name and timestamp */}
                <div className={`flex items-center gap-2 mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs font-semibold text-gray-500">
                    {isMine ? 'You' : msg.sender_username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Bubble */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;