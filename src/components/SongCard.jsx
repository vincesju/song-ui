import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';

export default function SongCard({ song, onPlay, index = 0, loading, isPlaying, compact = false }) {
  if (loading) {
    return <div className={compact ? 'card-skeleton card-skeleton-compact' : 'card-skeleton'} />;
  }

  const rootClass = compact ? 'song-card song-card-compact group' : 'song-card group';

  return (
    <Card
      component="button"
      type="button"
      className={rootClass}
      onClick={() => onPlay(song, index)}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.18)}s` }}
    >
      <div className="song-thumb-wrap rounded-xl overflow-hidden">
        <CardMedia component="img" image={song.thumbnail} alt={song.title} className="song-thumb" />
        <span className="song-duration">{song.duration}</span>
      </div>

      <CardContent className="song-meta p-0 text-left">
        <Typography variant="subtitle2" className="song-title font-semibold">{song.title}</Typography>
        <Typography variant="caption" className="song-channel block">{song.channel}</Typography>
        <Typography variant="caption" className="song-stats block">
          {song.views} • {song.publishedAt}
        </Typography>
      </CardContent>

      {isPlaying ? <Chip size="small" label="Playing" color="primary" className="playing-tag" /> : null}
    </Card>
  );
}