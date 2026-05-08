import YouTube from "react-youtube";
import { useEffect, useRef } from "react";
import { Card } from "antd";

function VideoPlayer({ videoId, setDuration }) {
  const playerRef = useRef(null);

  const onReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  useEffect(() => {
    window.seekTo = (time) => {
      if (playerRef.current) {
        playerRef.current.seekTo(time, true);
        playerRef.current.playVideo();
      }
    };

    return () => {
      delete window.seekTo;
    };
  }, []);

  return (
    <Card className="shadow-lg">
      {videoId ? (
        <YouTube
          videoId={videoId}
          onReady={onReady}
          opts={{ width: "100%", height: "400" }}
        />
      ) : (
        <div className="text-center text-gray-500 flex justify-center items-center h-[500px]">
          Load a video to start
        </div>
      )}
    </Card>
  );
}

export default VideoPlayer
