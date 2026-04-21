import { Chip, Paper, Typography } from '@mui/material';
import ReactPlayer from 'react-player';

const getYoutubeEmbedUrl = (url = '') => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1];
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
      }

      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
    }
  } catch {
    return '';
  }

  return '';
};

export default function VideoPlayer({ song, loading, onNext }) {
  if (loading) {
    return <div className="video-skeleton" />;
  }

  if (!song) {
    return <Paper className="video-empty">Pick a song to start watching.</Paper>;
  }

  const embedUrl = getYoutubeEmbedUrl(song.videoUrl);

  return (
    <Paper elevation={0} className="player-shell bg-transparent">
      <div className="player-frame">
        {embedUrl ? (
          <iframe
            title={song.title}
            src={embedUrl}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <ReactPlayer
            url={song.videoUrl}
            playing
            controls
            width="100%"
            height="100%"
            onEnded={onNext}
          />
        )}
      </div>

      <div className="player-meta flex flex-col gap-2">
        <Typography variant="h6" className="player-title font-bold">{song.title}</Typography>
        <Typography variant="body2" className="player-subtitle">
          {song.channel} • {song.views} • {song.publishedAt}
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Chip size="small" label={song.channel} />
          <Chip size="small" label={song.duration} color="primary" variant="outlined" />
        </div>
      </div>
    </Paper>
  );
}