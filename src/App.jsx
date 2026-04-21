import { useEffect, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppBar, Avatar, Box, Chip, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SongGrid from './components/SongGrid';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import NowPlaying from './components/NowPlaying';
import { fetchSongs } from './services/api';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff4455' },
    background: {
      default: '#0f1115',
      paper: '#151a22',
    },
  },
  shape: {
    borderRadius: 14,
  },
});

function App() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Home');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const data = await fetchSongs();
        setSongs(data);
        setSelectedSong(data[0] ?? null);
      } catch {
        setError('Unable to load songs. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const filteredSongs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return songs;

    return songs.filter((song) => {
      return (
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword) ||
        song.channel.toLowerCase().includes(keyword)
      );
    });
  }, [songs, searchTerm]);

  const viewSongs = useMemo(() => {
    switch (activeMenu) {
      case 'Library': {
        const librarySongs = filteredSongs.filter((song) => {
          const haystack = `${song.genre ?? ''} ${song.artist ?? ''}`.toLowerCase();
          return haystack.includes('opm') || haystack.includes('eraserheads');
        });
        return librarySongs.length > 0 ? librarySongs : filteredSongs;
      }
      case 'Trending': {
        return [...filteredSongs].sort((a, b) => Number(b.id) - Number(a.id));
      }
      case 'Playlists': {
        const groupedByAlbum = [...filteredSongs].sort((a, b) => {
          const albumA = (a.album ?? '').toLowerCase();
          const albumB = (b.album ?? '').toLowerCase();
          return albumA.localeCompare(albumB);
        });
        return groupedByAlbum;
      }
      case 'Explore':
      case 'Home':
      default:
        return filteredSongs;
    }
  }, [activeMenu, filteredSongs]);

  const currentQueue = viewSongs.length > 0 ? viewSongs : songs;

  const currentIndex = useMemo(() => {
    if (!selectedSong) return -1;
    return currentQueue.findIndex((song) => song.id === selectedSong.id);
  }, [currentQueue, selectedSong]);

  const relatedSongs = useMemo(() => {
    if (!selectedSong) return currentQueue.slice(0, 5);
    return currentQueue.filter((song) => song.id !== selectedSong.id).slice(0, 8);
  }, [currentQueue, selectedSong]);

  const handlePlaySong = (song) => {
    setSelectedSong(song);
  };

  const handleNext = () => {
    if (currentQueue.length === 0) return;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % currentQueue.length : 0;
    setSelectedSong(currentQueue[nextIndex]);
  };

  const handlePrevious = () => {
    if (currentQueue.length === 0) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentQueue.length - 1;
    setSelectedSong(currentQueue[prevIndex]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <Sidebar activeMenu={activeMenu} onSelectMenu={setActiveMenu} />

        <main className="content-shell">
          <AppBar position="sticky" elevation={0} color="transparent" className="topbar">
            <Toolbar className="flex items-center justify-between gap-3 p-0">
              <TextField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search songs, artists, channels"
                size="small"
                className="w-full max-w-xl"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box className="flex items-center gap-2">
                <Chip label={activeMenu} color="primary" size="small" />
                <Chip label={`${filteredSongs.length} songs`} color="primary" variant="outlined" size="small" />
                <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
              </Box>
            </Toolbar>
          </AppBar>

          <section className="watch-layout">
            <div className="watch-main">
              <VideoPlayer
                song={selectedSong}
                loading={loading}
                onNext={handleNext}
              />
              {error ? <p className="error-text">{error}</p> : null}
            </div>

            <aside className="watch-side">
              <Typography variant="h6" className="panel-title font-semibold">Up next</Typography>
              <SongGrid
                songs={relatedSongs}
                onPlaySong={handlePlaySong}
                loading={loading}
                currentPlayingId={selectedSong?.id}
                compact
              />
            </aside>
          </section>

          <section className="recommend-layout">
            <Typography variant="h6" className="panel-title font-semibold">Recommended</Typography>
            <SongGrid
              songs={viewSongs}
              onPlaySong={handlePlaySong}
              loading={loading}
              currentPlayingId={selectedSong?.id}
            />
          </section>
        </main>

        {selectedSong ? (
          <NowPlaying
            song={selectedSong}
            onClose={() => setSelectedSong(null)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        ) : null}
      </div>
    </ThemeProvider>
  );
}

export default App;