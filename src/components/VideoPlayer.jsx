import { Chip, Paper, Typography } from '@mui/material';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ song, loading, onNext, isPlaying, onPlayStateChange }) {
  if (loading) {
    return <div className="video-skeleton" />;
  }

  if (!song) {
    return <Paper className="video-empty">Pick a song to start watching.</Paper>;
  }

  return (
    <Paper elevation={0} className="player-shell bg-transparent">
      <div className="player-frame">
        <ReactPlayer
          key={song.id ?? song.videoUrl}
          src={song.videoUrl}
          playing={isPlaying}
          controls
          width="100%"
          height="100%"
          onPlay={() => onPlayStateChange(true)}
          onPause={() => onPlayStateChange(false)}
          onEnded={onNext}
        />
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