// src/components/groups/VideoRoomLink.jsx

const VideoRoomLink = ({ videoRoomLink }) => {
  if (!videoRoomLink || !videoRoomLink.jitsi_url) {
    return null;
  }

  return (
    <a
      href={videoRoomLink.jitsi_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-green-600 text-white text-sm font-medium
                 hover:bg-green-700 active:bg-green-800
                 shadow-sm hover:shadow-md
                 transition-all duration-200 ease-in-out
                 focus:outline-none focus:ring-4 focus:ring-green-200"
      title="Join video meeting"
    >
      {/* Camera icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <span>Join</span>
    </a>
  );
};

export default VideoRoomLink;