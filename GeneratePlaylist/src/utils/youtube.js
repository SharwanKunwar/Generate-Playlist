export const extractVideoId = (url) => {
  const regExp =
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};