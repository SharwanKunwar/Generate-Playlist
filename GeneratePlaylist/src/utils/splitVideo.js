export function splitVideo(duration, interval) {
  const segments = [];
  let start = 0;

  while (start < duration) {
    const end = Math.min(start + interval, duration);
    segments.push({ start, end });
    start = end;
  }

  return segments;
}