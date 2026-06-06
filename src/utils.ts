export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractFilenameFromUrl(url: string): string {
  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1];
  if (!filename.includes('.')) {
    filename = `video_${Date.now()}.mp4`;
  }
  return filename;
}