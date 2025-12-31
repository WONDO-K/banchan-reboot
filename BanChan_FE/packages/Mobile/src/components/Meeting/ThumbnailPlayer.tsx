import React, { useEffect, useRef } from "react";
import { ThumbnailPlayerProps } from "../../Types";

const ThumbnailPlayer: React.FC<ThumbnailPlayerProps> = ({
  stream,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={`w-[330px] h-[300px] bg-black object-cover rounded-[12px] ${className}`}
      autoPlay
      playsInline
      muted
    ></video>
  );
};

export default ThumbnailPlayer;
