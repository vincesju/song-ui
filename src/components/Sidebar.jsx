import { List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

const menuItems = [
  { icon: '🏠', label: 'Home' },
  { icon: '🧭', label: 'Explore' },
  { icon: '🎧', label: 'Library' },
  { icon: '🔥', label: 'Trending' },
  { icon: '📼', label: 'Playlists' },
];

export default function Sidebar({ activeMenu, onSelectMenu }) {
  return (
    <Paper elevation={0} square className="sidebar-shell">
      <Typography variant="h6" className="brand-mark font-black">SongTube</Typography>

      <List className="sidebar-nav space-y-1">
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            className={`side-item ${activeMenu === item.label ? 'side-item-active' : ''}`}
            disableRipple
            onClick={() => onSelectMenu(item.label)}
          >
            <span className="side-icon">{item.icon}</span>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Typography variant="caption" className="sidebar-footer">
        Music and videos with a YouTube-inspired layout
      </Typography>
    </Paper>
  );
}