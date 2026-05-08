import { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import { splitVideo } from "../utils/splitVideo";
import { formatTime } from "../utils/time";
import { extractVideoId } from "../utils/youtube";
import { usePlaylistStore } from "../store/usePlaylistStore";

const INTERVALS = [
    { label: "10 min", value: 600 },
    { label: "30 min", value: 1800 },
    { label: "1 hour", value: 3600 },
];

const SPEEDS = [1, 1.25, 1.5, 2];

function HomePage() {
    const youtubePlayerRef = useRef(null);
    const localVideoRef = useRef(null);
    const fileInputRef = useRef(null);
    const objectUrlRef = useRef("");

    const { playlists, addPlaylist, removePlaylist, updatePlaylist } =
        usePlaylistStore();

    const [sourceType, setSourceType] = useState("youtube");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [videoId, setVideoId] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [duration, setDuration] = useState(0);
    const [interval, setIntervalValue] = useState(1800);
    const [customMinutes, setCustomMinutes] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);
    const [completed, setCompleted] = useState([]);
    const [speed, setSpeed] = useState(1);
    const [playlistName, setPlaylistName] = useState("");
    const [loadedPlaylistId, setLoadedPlaylistId] = useState(null);
    const [status, setStatus] = useState("Add a YouTube link or upload a video.");

    const canSplit = duration > 0 && interval > 0;
    const segments = useMemo(
        () => (canSplit ? splitVideo(Math.floor(duration), interval) : []),
        [canSplit, duration, interval],
    );
    const activeSegment = activeIndex === null ? null : segments[activeIndex];
    const segmentCount = segments.length;
    const saveDisabled = segmentCount === 0;
    const saveButtonLabel = loadedPlaylistId ? "Update playlist" : "Save playlist";

    const sourceLabel = useMemo(() => {
        if (sourceType === "youtube" && videoId) return `YouTube: ${videoId}`;
        if (sourceType === "upload" && fileName) return fileName;
        return "No video loaded";
    }, [fileName, sourceType, videoId]);

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        };
    }, []);

    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.playbackRate = speed;
        }

        if (youtubePlayerRef.current?.setPlaybackRate) {
            youtubePlayerRef.current.setPlaybackRate(speed);
        }
    }, [speed]);

    useEffect(() => {
        if (sourceType !== "youtube" || !activeSegment) return undefined;

        const timer = window.setInterval(() => {
            const player = youtubePlayerRef.current;
            if (!player?.getCurrentTime) return;

            const currentTime = player.getCurrentTime();
            if (currentTime >= activeSegment.end) {
                player.pauseVideo();
                markCompleted(activeIndex);
            }
        }, 400);

        return () => window.clearInterval(timer);
    }, [activeIndex, activeSegment, sourceType]);

    function resetCurrentVideo() {
        setDuration(0);
        setActiveIndex(null);
        setCompleted([]);
        setLoadedPlaylistId(null);
    }

    function changeInterval(nextInterval) {
        setIntervalValue(nextInterval);
        setActiveIndex(null);
        setCompleted([]);
    }

    function loadYoutubeVideo() {
        const id = extractVideoId(youtubeUrl);

        if (!id) {
            setStatus("Paste a valid YouTube URL first.");
            return;
        }

        setSourceType("youtube");
        setVideoId(id);
        setFileUrl("");
        setFileName("");
        resetCurrentVideo();
        setStatus("Loading YouTube duration...");
    }

    function loadUploadedVideo(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

        const nextUrl = URL.createObjectURL(file);
        objectUrlRef.current = nextUrl;

        setSourceType("upload");
        setFileUrl(nextUrl);
        setFileName(file.name);
        setVideoId("");
        resetCurrentVideo();
        setStatus("Reading uploaded video duration...");
    }

    function handleYoutubeReady(event) {
        youtubePlayerRef.current = event.target;
        const videoDuration = Math.floor(event.target.getDuration() || 0);

        if (videoDuration > 0) {
            setDuration(videoDuration);
            setStatus("Video loaded. Choose a segment length and start learning.");
        }
    }

    function handleLocalMetadata() {
        const videoDuration = Math.floor(localVideoRef.current?.duration || 0);

        if (videoDuration > 0) {
            setDuration(videoDuration);
            setStatus("Video loaded. Choose a segment length and start learning.");
        }
    }

    function seekToSegment(index) {
        const segment = segments[index];
        if (!segment) return;

        setActiveIndex(index);

        if (sourceType === "youtube" && youtubePlayerRef.current) {
            youtubePlayerRef.current.seekTo(segment.start, true);
            youtubePlayerRef.current.playVideo();
            youtubePlayerRef.current.setPlaybackRate(speed);
        }

        if (sourceType === "upload" && localVideoRef.current) {
            localVideoRef.current.currentTime = segment.start;
            localVideoRef.current.playbackRate = speed;
            localVideoRef.current.play();
        }
    }

    function markCompleted(index) {
        if (index === null) return;
        setCompleted((current) =>
            current.includes(index) ? current : [...current, index],
        );
    }

    function handleLocalTimeUpdate() {
        if (!activeSegment || !localVideoRef.current) return;

        if (localVideoRef.current.currentTime >= activeSegment.end) {
            localVideoRef.current.pause();
            markCompleted(activeIndex);
        }
    }

    function savePlaylist() {
        if (!segmentCount) {
            setStatus("Load a video first. Save becomes available after segments are generated.");
            return;
        }

        const playlist = {
            id: loadedPlaylistId || Date.now(),
            name: playlistName.trim() || `${sourceLabel} playlist`,
            createdAt: new Date().toISOString(),
            sourceType,
            videoId,
            sourceName: sourceLabel,
            duration,
            interval,
            segments,
            completed,
        };

        if (loadedPlaylistId) {
            updatePlaylist(loadedPlaylistId, playlist);
        } else {
            addPlaylist(playlist);
            setLoadedPlaylistId(playlist.id);
        }

        setPlaylistName(playlist.name);
        setStatus(
            `${playlist.name} saved with ${playlist.segments.length} parts. Find it in Local playlists.`,
        );
    }

    function loadSavedPlaylist(playlist) {
        if (playlist.sourceType === "upload") {
            setStatus("Saved uploaded playlists keep their segments. Re-upload the video file to play it again.");
            setSourceType("upload");
            setVideoId("");
            setFileName(playlist.sourceName);
            setFileUrl("");
        } else {
            setSourceType("youtube");
            setVideoId(playlist.videoId);
            setYoutubeUrl(`https://www.youtube.com/watch?v=${playlist.videoId}`);
        }

        setDuration(playlist.duration);
        setIntervalValue(playlist.interval);
        setCompleted(playlist.completed || []);
        setPlaylistName(playlist.name);
        setLoadedPlaylistId(playlist.id);
        setActiveIndex(null);
    }

    function applyCustomInterval() {
        const minutes = Number(customMinutes);

        if (!minutes || minutes <= 0) {
            setStatus("Enter a custom duration greater than 0 minutes.");
            return;
        }

        changeInterval(Math.round(minutes * 60));
    }

    return (
        <main className="shortconcept-shell">
            <aside className="playlist-panel">
                <div className="brand-row">
                    <div>
                        <p className="eyebrow">ShortConcept</p>
                        <h1>Segment playlist</h1>
                    </div>
                    <span className="duration-pill">{duration ? formatTime(duration) : "--:--"}</span>
                </div>

                <div className="now-card">
                    <span>Current source</span>
                    <strong>{sourceLabel}</strong>
                    <small>{segmentCount} generated parts</small>
                </div>

                <div className="segment-list" aria-label="Generated segments">
                    {segments.length === 0 ? (
                        <div className="empty-state">
                            Load a video and choose a split length to generate a playlist.
                        </div>
                    ) : (
                        segments.map((segment, index) => {
                            const isActive = activeIndex === index;
                            const isComplete = completed.includes(index);

                            return (
                                <button
                                    className={`segment-item ${isActive ? "active" : ""}`}
                                    key={`${segment.start}-${segment.end}`}
                                    onClick={() => seekToSegment(index)}
                                    type="button"
                                >
                                    <span className="part-number">{String(index + 1).padStart(2, "0")}</span>
                                    <span>
                                        <strong>Part {index + 1}</strong>
                                        <small>
                                            {formatTime(segment.start)} - {formatTime(segment.end)}
                                        </small>
                                    </span>
                                    <em>{isComplete ? "Done" : isActive ? "Playing" : "Play"}</em>
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>

            <section className="workspace">
                <header className="topbar">
                    <div>
                        <p className="eyebrow">Long videos, cleaner study sessions</p>
                        <h2>Split YouTube or local videos into playable chapters.</h2>
                    </div>
                    <div className="save-actions">
                        <button
                            className="ghost-button"
                            disabled={saveDisabled}
                            onClick={savePlaylist}
                            title={
                                saveDisabled
                                    ? "Load a video first so ShortConcept can generate segments."
                                    : "Save this segment playlist in your browser."
                            }
                            type="button"
                        >
                            {saveButtonLabel}
                        </button>
                        <span>{saveDisabled ? "Waiting for video segments" : status}</span>
                    </div>
                </header>

                <div className="player-frame">
                    {sourceType === "youtube" && videoId ? (
                        <YouTube
                            className="youtube-player"
                            iframeClassName="youtube-iframe"
                            onReady={handleYoutubeReady}
                            opts={{
                                playerVars: { modestbranding: 1, rel: 0 },
                            }}
                            videoId={videoId}
                        />
                    ) : sourceType === "upload" && fileUrl ? (
                        <video
                            controls
                            onLoadedMetadata={handleLocalMetadata}
                            onTimeUpdate={handleLocalTimeUpdate}
                            ref={localVideoRef}
                            src={fileUrl}
                        >
                            <track kind="captions" />
                        </video>
                    ) : (
                        <div className="player-placeholder">
                            <strong>Load a video to begin</strong>
                            <span>YouTube URLs and uploaded video files are supported.</span>
                        </div>
                    )}
                </div>

                <div className="control-grid">
                    <section className="control-panel">
                        <h3>Video input</h3>
                        <div className="source-tabs">
                            <button
                                className={sourceType === "youtube" ? "selected" : ""}
                                onClick={() => setSourceType("youtube")}
                                type="button"
                            >
                                YouTube
                            </button>
                            <button
                                className={sourceType === "upload" ? "selected" : ""}
                                onClick={() => setSourceType("upload")}
                                type="button"
                            >
                                Upload
                            </button>
                        </div>

                        {sourceType === "youtube" ? (
                            <div className="input-row">
                                <input
                                    onChange={(event) => setYoutubeUrl(event.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    type="url"
                                    value={youtubeUrl}
                                />
                                <button onClick={loadYoutubeVideo} type="button">
                                    Load
                                </button>
                            </div>
                        ) : (
                            <div className="upload-row">
                                <input
                                    accept="video/*"
                                    onChange={loadUploadedVideo}
                                    ref={fileInputRef}
                                    type="file"
                                />
                                <button onClick={() => fileInputRef.current?.click()} type="button">
                                    Choose video
                                </button>
                                <span>{fileName || "No file selected"}</span>
                            </div>
                        )}
                    </section>

                    <section className="control-panel">
                        <h3>Split length</h3>
                        <div className="interval-options">
                            {INTERVALS.map((option) => (
                                <button
                                    className={interval === option.value ? "selected" : ""}
                                    key={option.value}
                                    onClick={() => changeInterval(option.value)}
                                    type="button"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="input-row compact">
                            <input
                                min="1"
                                onChange={(event) => setCustomMinutes(event.target.value)}
                                placeholder="Custom minutes"
                                type="number"
                                value={customMinutes}
                            />
                            <button onClick={applyCustomInterval} type="button">
                                Apply
                            </button>
                        </div>
                    </section>

                    <section className="control-panel">
                        <h3>Playback</h3>
                        <div className="speed-options">
                            {SPEEDS.map((option) => (
                                <button
                                    className={speed === option ? "selected" : ""}
                                    key={option}
                                    onClick={() => setSpeed(option)}
                                    type="button"
                                >
                                    {option}x
                                </button>
                            ))}
                        </div>
                        <p>{status}</p>
                    </section>

                    <section className="control-panel">
                        <div className="panel-title-row">
                            <h3>Local playlists</h3>
                            <span>{playlists.length}</span>
                        </div>
                        <div className="input-row compact">
                            <input
                                onChange={(event) => setPlaylistName(event.target.value)}
                                placeholder="Playlist name"
                                type="text"
                                value={playlistName}
                            />
                            <button disabled={saveDisabled} onClick={savePlaylist} type="button">
                                {loadedPlaylistId ? "Update" : "Save"}
                            </button>
                        </div>
                        <div className="saved-list">
                            {playlists.length === 0 ? (
                                <span>No saved playlists yet</span>
                            ) : (
                                playlists
                                    .slice()
                                    .reverse()
                                    .map((playlist) => (
                                        <div className="saved-item" key={playlist.id}>
                                            <button onClick={() => loadSavedPlaylist(playlist)} type="button">
                                                <strong>{playlist.name}</strong>
                                                <small>
                                                    {playlist.segments.length} parts · {playlist.sourceName}
                                                </small>
                                            </button>
                                            <button
                                                aria-label={`Delete ${playlist.name}`}
                                                className="delete-button"
                                                onClick={() => removePlaylist(playlist.id)}
                                                type="button"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
