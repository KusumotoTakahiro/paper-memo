import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// 画面1のコンポーネント
const Home = () => (
  <div>
    <h2>Home</h2>
    <p>Welcome to the home page!</p>
  </div>
);

// 画面2のコンポーネント
const About = () => (
  <div>
    <h2>About</h2>
    <p>This is the about page.</p>
  </div>
);

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        (event as React.KeyboardEvent).key === 'Tab'
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  return (
    <Router>
      <div>
        <IconButton
          onClick={toggleDrawer(true)}
          color="inherit"
          edge="start"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </Drawer>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
