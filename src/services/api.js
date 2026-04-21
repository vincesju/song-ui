import axios from 'axios';

const MOCK_SONGS = [
  {
    id: 2,
    title: 'One',
    artist: 'U2',
    channel: 'U2',
    thumbnail: 'https://i.ytimg.com/vi/ftjEcrrf7r0/hqdefault.jpg',
    videoUrl: 'https://youtu.be/ftjEcrrf7r0',
    views: 'Rock mix',
    publishedAt: 'Album: Achtung Baby',
    duration: '4:36',
  },
  {
    id: 3,
    title: 'Sometimes',
    artist: 'Britney Spears',
    channel: 'Britney Spears',
    thumbnail: 'https://i.ytimg.com/vi/t0bPrt69rag/hqdefault.jpg',
    videoUrl: 'https://youtu.be/t0bPrt69rag',
    views: 'Pop mix',
    publishedAt: 'Album: ...Baby One More Time',
    duration: '4:08',
  },
  {
    id: 4,
    title: 'Ligaya',
    artist: 'Eraserheads',
    channel: 'Eraserheads',
    thumbnail: 'https://i.ytimg.com/vi/XibB-5BPdrY/hqdefault.jpg',
    videoUrl: 'https://youtu.be/XibB-5BPdrY',
    views: 'OPM mix',
    publishedAt: 'Album: Ultraelectromagneticpop!',
    duration: '4:08',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const pickDuration = (seed) => {
  const durations = ['2:33', '2:47', '3:00', '3:21', '3:24', '3:37', '3:51', '4:07'];
  return durations[Math.abs(seed) % durations.length];
};

const extractYoutubeId = (url = '') => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
  } catch {
    return '';
  }

  return '';
};

const toUiSong = (song) => {
  const id = Number(song.id ?? Date.now());
  const videoUrl = song.url?.trim() ? song.url : 'https://www.youtube.com/watch?v=4NRXx6U8ABQ';
  const ytId = extractYoutubeId(videoUrl);

  return {
    id,
    title: song.title || 'Untitled Song',
    artist: song.artist || 'Unknown Artist',
    channel: song.artist || 'Music Channel',
    thumbnail: ytId
      ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
      : 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
    videoUrl,
    views: song.genre ? `${song.genre} mix` : 'New upload',
    publishedAt: song.album ? `Album: ${song.album}` : 'Recently added',
    duration: pickDuration(id),
  };
};

export const fetchSongs = async () => {
  try {
    const response = await api.get('/sunga/songs');
    const records = Array.isArray(response.data) ? response.data : [];

    if (records.length === 0) {
      return MOCK_SONGS;
    }

    return records.map(toUiSong);
  } catch {
    return MOCK_SONGS;
  }
};