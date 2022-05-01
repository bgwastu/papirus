import { ActionIcon, Menu } from '@mantine/core';
import { GridDots, Logout } from 'tabler-icons-react';

interface Props {
  email: string | undefined;
  onLogout: () => void;
}

export default function MenuButton(props: Props) {
  return (
    <Menu
      control={
        <ActionIcon variant="default" color="dark" size="lg">
          <GridDots />
        </ActionIcon>
      }
    >
      <Menu.Label>Logged in as {props.email}</Menu.Label>
      <Menu.Item
        color="red"
        icon={<Logout size={14} />}
        onClick={props.onLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
}
