import {ActionIcon, Button, Container, Group, Kbd, Paper, Stack, Text} from '@mantine/core';
import {formatRelative} from 'date-fns';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import MenuButton from '../components/MenuButton';
import Navbar from '../components/Navbar';
import useUser from '../hooks/useUser';
import Note from '../interfaces/note';

export default function NoteDetailOwner({ note }: { note: Note }) {
  const [user] = useUser();
  const router = useRouter();

  function getTitle() {
    const doc = new DOMParser().parseFromString(note.content, 'text/html');
    return doc.getElementsByTagName('h1')[0].innerHTML;
  }
  return (
    <>
      <Head>
        <title>{getTitle()}</title>
      </Head>
      <Container my={20}>
        <Stack>
          <Navbar
            leading={
              <ActionIcon
                size="xl"
                onClick={() => {
                  if (user) {
                    router.push('/' + user.$id);
                  } else {
                    router.push('/');
                  }
                }}
              >
                <Image src="/papirus.png" layout="fill" alt="Papirus logo" />
              </ActionIcon>
            }
            menu={
              <>
                {user !== undefined ? (
                  <MenuButton email={user.email} onLogout={() => {}} />
                ) : (
                  <Button onClick={() => router.push('/')}>
                    Register, it{"'"}s free
                  </Button>
                )}
              </>
            }
          />
          <Group position="apart">
            <Group>
              <Text color="dimmed">
                {'Last updated: ' +
                  formatRelative(new Date(note.timestamp), new Date())}
              </Text>
            </Group>
            <Group>
              <Kbd>Public</Kbd>
            </Group>
          </Group>
          <Paper shadow="xs" px="md" pb="md" withBorder>
            <div
              className="ProseMirror"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
