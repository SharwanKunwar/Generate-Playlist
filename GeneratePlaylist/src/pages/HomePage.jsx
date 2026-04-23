import { useState } from "react";
import { Input, Button, Select } from "antd";
import { splitVideo } from "../utils/splitVideo";
import { extractVideoId } from "../utils/youtube";
import { usePlaylistStore } from "../store/usePlaylistStore";
import DurationInput from "../components/DurationInput";
import PlaylistCard from "../components/PlaylistCard";

const { Option } = Select;

function HomePage() {
    const [url, setUrl] = useState("");
    const [videoId, setVideoId] = useState("");
    const [duration, setDuration] = useState(0);
    const [segments, setSegments] = useState([]);
    const [interval, setInterval] = useState(3600);
    const [playlistName, setPlaylistName] = useState("");

    const { addPlaylist, playlists } = usePlaylistStore();

    // Load Video
    const handleLoad = () => {
        const id = extractVideoId(url);
        if (!id) return;

        setVideoId(id);

        // TEMP: fake duration (2 hours)
        setDuration(7200);
    };

    // Split Video
    const handleSplit = () => {
        if (!duration || !interval) return;

        const result = splitVideo(duration, interval);
        setSegments(result);
    };

    // Generate Playlist
    const handleGenerate = () => {
        if (!videoId || segments.length === 0) return;

        const newPlaylist = {
            id: Date.now(),
            name: playlistName || "Untitled Playlist",
            videoId,
            segments,
        };

        addPlaylist(newPlaylist);
    };

    // FIXED: Duration input handler
    const handleDurationChange = (minutes) => {
        if (!minutes) return;
        const seconds = minutes * 60;
        setInterval(seconds);
    };

    return (
        <div className="bg-slate-300 h-screen w-full p-5 flex flex-col gap-5">

            {/* FORM SECTION */}
            <div className="bg-gray-500 rounded-md shadow-md flex border-dotted border-2 h-full">

                {/* LEFT SIDE ---------------------------------------------------*/}
                <div className="w-1/2 flex flex-col gap-3 py-5 pl-5 h-full">

                    {/* INPUT BOX */}
                    <div className="bg-white/30 backdrop-blur-sm border shadow-md p-5 flex flex-col gap-3 rounded-md h-[520px]">

                        <h2 className="text-start border-b pb-5">
                            Provide your Youtube Video link
                        </h2>

                        <Input
                            size="large"
                            placeholder="Paste YouTube URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        {/* INTERVAL SECTION */}
                        <section className="rounded-2xl">

                            {/* PRESET INTERVAL */}
                            <Select
                                size="large"
                                value={interval}
                                onChange={(value) => setInterval(value)}
                                className="w-full"
                            >
                                <Option value={600}>Fixed 10 min</Option>
                                <Option value={1800}>Fixed 30 min</Option>
                                <Option value={3600}>Fixed 1 hour</Option>
                            </Select>

                            {/* CUSTOM DURATION INPUT */}
                            <div className="pt-3">
                                <DurationInput onChange={handleDurationChange} />
                            </div>

                        </section>

                        <Button
                            size="large"
                            type="primary"
                            onClick={handleLoad}
                            className="w-full mt-3"
                        >
                            Load URL
                        </Button>

                    </div>

                    {/* CREATE PLAYLIST */}
                    <div className="w-full flex flex-col gap-3 bg-white/30 backdrop-blur-sm p-5 rounded-md mt-5 border">

                        <h2 className="text-lg font-medium border-b pb-2 text-start">
                            Create Playlist
                        </h2>

                        <Input
                            size="large"
                            placeholder="Playlist name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />

                        <Button
                            size="large"
                            type="primary"
                            onClick={handleGenerate}
                        >
                            Generate Playlist
                        </Button>

                    </div>

                </div>

                {/* RIGHT SIDE --------------------------------------------------*/}
                <div className="w-[50%] h-full flex flex-col gap-3  p-5">

                    <h2 className="text-start text-white font-bold mt-5">Generated Playlist</h2>
                    {/* GENERATED PLAYLISTS */}
                    <div className="bg-white/30 backdrop-blur-sm h-full overflow-auto p-5 rounded-md py-5">

                        {playlists.length === 0 ? (
                            <p>No playlists generated yet</p>
                        ) : (
                            playlists
                                .slice()
                                .reverse()
                                .map((pl) => (
                                    <PlaylistCard key={pl.id} playlist={pl} />
                                ))
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HomePage;