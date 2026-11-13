// Convierte un link de video en algo que se pueda reproducir dentro de la web.
// Soporta: YouTube (videos y Shorts), Instagram (Reels/Posts), TikTok,
// Google Drive y archivos de video directos (.mp4, .webm, .mov).

const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
const IG_REGEX = /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/
const TIKTOK_REGEX = /tiktok\.com\/@[^/]+\/video\/(\d+)/
const DRIVE_REGEX = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([A-Za-z0-9_-]+)/
const FILE_REGEX = /\.(mp4|webm|mov|m4v)(\?.*)?$/i

export const VIDEO_SOURCES_HELP =
  'YouTube (videos o Shorts), Instagram (Reels), TikTok, Google Drive o un archivo .mp4'

/**
 * @returns {null | { type: 'youtube'|'instagram'|'tiktok'|'drive'|'file', src: string, vertical: boolean, label: string }}
 */
export const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const url = rawUrl.trim()
  if (!/^https?:\/\//i.test(url)) return null

  const yt = url.match(YT_REGEX)
  if (yt) {
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`,
      vertical: url.includes('/shorts/'),
      label: url.includes('/shorts/') ? 'YouTube Shorts' : 'YouTube',
    }
  }

  const ig = url.match(IG_REGEX)
  if (ig) {
    const kind = ig[1] === 'reels' ? 'reel' : ig[1]
    return {
      type: 'instagram',
      src: `https://www.instagram.com/${kind}/${ig[2]}/embed`,
      vertical: true,
      label: 'Instagram',
    }
  }

  const tt = url.match(TIKTOK_REGEX)
  if (tt) {
    return {
      type: 'tiktok',
      src: `https://www.tiktok.com/embed/v2/${tt[1]}`,
      vertical: true,
      label: 'TikTok',
    }
  }

  const drive = url.match(DRIVE_REGEX)
  if (drive) {
    return {
      type: 'drive',
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
      vertical: false,
      label: 'Google Drive',
    }
  }

  if (FILE_REGEX.test(url)) {
    return { type: 'file', src: url, vertical: false, label: 'Video' }
  }

  return null
}
