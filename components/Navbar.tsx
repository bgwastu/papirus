import { Group } from '@mantine/core';

interface Props {
  leading: React.ReactNode;
  menu: React.ReactNode;
}

export default function Navbar(props: Props) {
  return (
    <Group position="apart">
      {props.leading}
      <Group>{props.menu}</Group>
    </Group>
  );
}
