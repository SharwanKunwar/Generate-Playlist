export const splitVideo = (duration, interval) => {
  const segments = [];
  let start = 0;

  while (start < duration) {
    segments.push({
      start,
      end: Math.min(start + interval, duration),
    });
    start += interval;
  }

  return segments;
};