import { useEffect, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SongGrid from './components/SongGrid';
import VideoPlayer from './components/VideoPlayer';
import NowPlaying from './components/NowPlaying';
import { fetchSongs } from './services/api';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff3b4e' },
    secondary: { main: '#5da9ff' },
    background: {
      default: '#070809',
      paper: '#11151c',
    },
    text: {
      primary: '#f3f6fc',
      secondary: '#a7b3c7',
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const data = await fetchSongs();
        setSongs(data);
        setSelectedSong(data[0] ?? null);
        setIsPlaying(true);
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

  const viewSongs = filteredSongs;

  const searchSuggestions = useMemo(() => {
    const keyword = searchTerm.trim();
    if (!keyword) return [];
    return filteredSongs.slice(0, 6);
  }, [filteredSongs, searchTerm]);

  const playbackQueue = songs;

  const currentIndex = useMemo(() => {
    if (!selectedSong) return -1;
    return playbackQueue.findIndex((song) => song.id === selectedSong.id);
  }, [playbackQueue, selectedSong]);

  const relatedSongs = useMemo(() => {
    if (!selectedSong) return playbackQueue.slice(0, 5);
    return playbackQueue.filter((song) => song.id !== selectedSong.id).slice(0, 8);
  }, [playbackQueue, selectedSong]);

  const handlePlaySong = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
  };

  const handleSelectSuggestion = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
    setSearchTerm(song.title);
    setIsSearchOpen(false);
  };

  const handleNext = () => {
    if (playbackQueue.length === 0) return;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % playbackQueue.length : 0;
    setSelectedSong(playbackQueue[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (playbackQueue.length === 0) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playbackQueue.length - 1;
    setSelectedSong(playbackQueue[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <main className="content-shell">
          <AppBar position="sticky" elevation={0} color="transparent" className="topbar">
            <Toolbar className="flex items-center justify-between gap-3 p-0">
              <ClickAwayListener onClickAway={() => setIsSearchOpen(false)}>
                <Box className="topbar-search-wrap w-full max-w-xl">
                  <TextField
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => {
                      if (searchTerm.trim()) {
                        setIsSearchOpen(true);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setIsSearchOpen(false);
                      }
                      if (event.key === 'Enter' && searchSuggestions.length > 0) {
                        handleSelectSuggestion(searchSuggestions[0]);
                      }
                    }}
                    placeholder="Search songs, artists, channels"
                    size="small"
                    className="w-full"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {isSearchOpen && searchSuggestions.length > 0 ? (
                    <Box className="search-dropdown">
                      <List className="search-results-list">
                        {searchSuggestions.map((song) => (
                          <ListItemButton
                            key={song.id}
                            className="search-result-item"
                            onClick={() => handleSelectSuggestion(song)}
                          >
                            <ListItemText
                              primary={song.title}
                              secondary={`${song.artist} • ${song.album ?? 'Single'}`}
                              primaryTypographyProps={{ className: 'search-result-primary' }}
                              secondaryTypographyProps={{ className: 'search-result-secondary' }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Box>
                  ) : null}
                </Box>
              </ClickAwayListener>
              <Box className="flex items-center gap-2">
                <Chip label="All songs" color="primary" size="small" />
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
                isPlaying={isPlaying}
                onPlayStateChange={setIsPlaying}
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
            isPlaying={isPlaying}
            onTogglePlayPause={() => setIsPlaying((prev) => !prev)}
          />
        ) : null}
      </div>
    </ThemeProvider>
  );
}

export default App;