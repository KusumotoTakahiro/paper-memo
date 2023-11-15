import React, { useState } from 'react';
import { Button, Menu, Segment, Sidebar } from 'semantic-ui-react';

const HamburgerMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };

  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width="thin"
      >
        <Menu.Item as="a">Home</Menu.Item>
        <Menu.Item as="a">About</Menu.Item>
        <Menu.Item as="a">Contact</Menu.Item>
      </Sidebar>

      <Sidebar.Pusher dimmed={visible}>
        <Segment basic>
          <Button icon="sidebar" onClick={handleToggle} />
          <p>Main Content Goes Here</p>
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default HamburgerMenu;
