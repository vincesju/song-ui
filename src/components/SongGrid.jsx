import SongCard from './SongCard';

export default function SongGrid({ songs, onPlaySong, loading, currentPlayingId, compact = false }) {
  const items = loading ? Array.from({ length: compact ? 6 : 8 }, (_, i) => ({ id: `sk-${i}` })) : songs;

  if (!loading && songs.length === 0) {
    return (
      <div className="empty-grid">No songs found. Try another search keyword.</div>
    );
  }

  return (
    <div className={compact ? 'song-grid song-grid-compact' : 'song-grid'}>
      {items.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          onPlay={onPlaySong}
          index={index}
          loading={loading}
          compact={compact}
          isPlaying={currentPlayingId === song.id}
        />
      ))}
    </div>
  );
}