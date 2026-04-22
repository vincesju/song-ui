import { Button, Paper, Typography } from '@mui/material';

export default function NowPlaying({ song, onClose, onNext, onPrevious, isPlaying, onTogglePlayPause }) {

  return (
    <Paper elevation={8} square className="now-playing-shell">
      <div className="now-track flex items-center gap-2">
        <img src={song.thumbnail} alt={song.title} className="now-thumb" />
        <div>
          <Typography variant="subtitle2" className="now-title">{song.title}</Typography>
          <Typography variant="caption" className="now-channel">{song.channel}</Typography>
        </div>
      </div>

      <div className="now-controls flex items-center gap-2">
        <Button type="button" onClick={onPrevious} className="now-button" size="small" variant="outlined">
          Prev
        </Button>
        <Button
          type="button"
          onClick={onTogglePlayPause}
          className="now-button now-button-main"
          size="small"
          variant="contained"
          color="primary"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button type="button" onClick={onNext} className="now-button" size="small" variant="outlined">
          Next
        </Button>
      </div>

      <Button type="button" onClick={onClose} className="now-close" size="small" variant="text">
        Close
      </Button>
    </Paper>
  );
}