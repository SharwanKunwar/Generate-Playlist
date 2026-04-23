function PlaylistCard({ playlist }) {
    return (
        <div className="bg-white p-3 mb-2 rounded shadow">

            <h3 className="font-bold text-lg">
                {playlist.name}
            </h3>

            <p className="text-sm">
                Video ID: {playlist.videoId}
            </p>

            <p className="text-sm">
                Segments: {playlist.segments.length}
            </p>

            <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                    View segments
                </summary>

                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
                    {JSON.stringify(playlist.segments, null, 2)}
                </pre>
            </details>

        </div>
    );
}
export default PlaylistCard