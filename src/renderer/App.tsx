import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import CreatePage from './pages/Create';
import SettingPage from './pages/Setting';
import LogoutPage from './pages/logout';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';

import Menu from '@mui/icons-material/Menu';
import Home from '@mui/icons-material/Home';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const iconList = [
    <Home />,
    <FormatListNumbered />,
    <SettingsIcon />,
    <LogoutIcon />,
  ];

  const routePath = ['#home', '#create', '#setting', '#logout'];

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor = 'left') => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Home', 'create an index', 'my page', 'log out'].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton href={routePath[index]}>
                <ListItemIcon>{iconList[index]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ),
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Fab
        onClick={toggleDrawer('left', true)}
        aria-label="menu"
        size="medium"
        style={{
          position: 'fixed',
          top: 10,
          left: 20,
          color: 'white',
          backgroundColor: '#abded1',
        }}
      >
        <Menu />
      </Fab>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list()}
      </Drawer>
      <HashRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </HashRouter>
    </>
  );
}
