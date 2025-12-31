import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={`bg-black ${className}`}
      autoPlay
      playsInline
      muted
    ></video>
  );
};

export default VideoPlayer;
