import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'tabler-icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        variant='default'
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.yellow[4]
              : theme.colors.dark[6],
        })}
      >
        {colorScheme === 'dark' ? (
          <Sun width={20} height={20} />
        ) : (
          <Moon width={20} height={20} />
        )}
      </ActionIcon>
  );
}
