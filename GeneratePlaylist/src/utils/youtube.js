export function extractVideoId(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").slice(0, 11);
    }

    if (parsed.hostname.includes("youtube.com")) {
      const watchId = parsed.searchParams.get("v");
      if (watchId) return watchId.slice(0, 11);

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) =>
        ["embed", "shorts", "live"].includes(part),
      );

      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1].slice(0, 11);
      }
    }
  } catch {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[?&/]|$)/);
    return match ? match[1] : "";
  }

  return "";
}
