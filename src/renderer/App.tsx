import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import CreatePage from './pages/Create';
import SettingPage from './pages/Setting';
import LogoutPage from './pages/logout';
import WordCloud from './pages/WordCloud';
import TaskManagement from './pages/TaskManagement';
import MyDictionary from './MyDictionary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlashAlert from './components/SpringFlashAlert';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';

import Menu from '@mui/icons-material/Menu';
import Home from '@mui/icons-material/Home';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });
  const [severity, setSeverity] = React.useState('info');
  const [message, setMessage] = React.useState('');
  const [nowDate, setNowDate] = React.useState('0');
  const [alertTitle, setAlertTitle] = React.useState('');
  const showFlashAlert = (
    severity: string,
    message: string,
    alertTitle: string,
  ) => {
    setSeverity(severity);
    setMessage(message);
    setAlertTitle(alertTitle);
    if (alertTitle === '') {
      setAlertTitle(severity);
    }
    setNowDate(String(Date.now()));
  };

  const iconList = [
    <Home />,
    // <FormatListNumbered />,
    <AssignmentIcon />,
    <SettingsIcon />,
    <FilterDramaIcon />,
    <LogoutIcon />,
  ];

  const routePath = ['#home', '#dict', '#setting', '#wordcloud'];

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
        {['Home', 'MyDictionary', 'Setting', 'WordCloud'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton href={routePath[index]}>
              <ListItemIcon>{iconList[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
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
          backgroundColor: '#abb8de',
        }}
      >
        <Menu />
      </Fab>
      <FlashAlert
        severity={severity}
        message={message}
        createdAt={nowDate}
        alertTitle={alertTitle}
      />
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list()}
      </Drawer>
      <HashRouter>
        <Routes>
          <Route
            path="/home"
            element={<HomePage showFlashAlert={showFlashAlert} />}
          />
          <Route path="/create" element={<CreatePage />} />
          <Route
            path="/setting"
            element={<SettingPage showFlashAlert={showFlashAlert} />}
          />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/wordcloud"
            element={<WordCloud showFlashAlert={showFlashAlert} />}
          ></Route>
          <Route
            path="/dict"
            element={<MyDictionary showFlashAlert={showFlashAlert} />}
          ></Route>
          <Route
            path="/"
            element={<HomePage showFlashAlert={showFlashAlert} />}
          />
        </Routes>
      </HashRouter>
    </>
  );
}
