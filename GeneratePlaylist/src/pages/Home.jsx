import { useState } from "react";
import { Input, Button, Select, Card } from "antd";
import { splitVideo } from "../utils/splitVideo";
import { extractVideoId } from "../utils/youtube";
import VideoPlayer from "../components/VideoPlayer.jsx";
import Playlist from "../components/Playlist";

const { Option } = Select;

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [duration, setDuration] = useState(0);
  const [segments, setSegments] = useState([]);
  const [interval, setInterval] = useState(3600);

  const handleLoad = () => {
    const id = extractVideoId(url);
    setVideoId(id);
  };

  const handleSplit = () => {
    if (!duration) return;
    setSegments(splitVideo(duration, interval));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center text-gray-800">
          🎬 ShortConcept
        </h1>

        <Card className="shadow-lg">
          <div className="flex gap-2">
            <Input
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="primary" onClick={handleLoad}>
              Load
            </Button>
          </div>

          <div className="flex gap-4 mt-4">
            <Select
              defaultValue={3600}
              onChange={(value) => setInterval(value)}
              style={{ width: 150 }}
            >
              <Option value={600}>10 min</Option>
              <Option value={1800}>30 min</Option>
              <Option value={3600}>1 hour</Option>
            </Select>

            <Button type="primary" onClick={handleSplit}>
              Generate Playlist
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <VideoPlayer videoId={videoId} setDuration={setDuration} />
          </div>

          <div>
            <Playlist segments={segments} />
          </div>
        </div>

      </div>
    </div>
  );
}