export function extractVideoId(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url.trim());

    // youtu.be/VIDEO_ID
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1, 12);
    }

    // youtube.com
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;

      const parts = parsed.pathname.split("/").filter(Boolean);
      const i = parts.findIndex(p =>
        ["embed", "shorts", "live"].includes(p)
      );

      if (i !== -1 && parts[i + 1]) {
        return parts[i + 1];
      }
    }
  } catch {
    const match = url.match(
      /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[?&/]|$)/
    );
    return match ? match[1] : "";
  }

  return "";
}