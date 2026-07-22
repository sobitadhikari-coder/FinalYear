// src/components/groups/MessageList.jsx

const MessageList = ({ messages, currentUsername }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const isMine = msg.sender_username === currentUsername;
        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%] gap-2`}>
              {/* Avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                {msg.sender_username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                {/* Sender name and timestamp */}
                <div className={`flex items-center gap-2 mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs font-medium text-gray-500">
                    {isMine ? 'You' : msg.sender_username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-200 text-gray-800 rounded-bl-md'
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