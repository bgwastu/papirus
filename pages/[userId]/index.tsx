import {
  ActionIcon,
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  Menu,
  Stack,
} from '@mantine/core';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GridDots, Logout, Note, Search } from 'tabler-icons-react';
import ListNote from '../../components/ListNote';
import { appwrite } from '../../stores/global';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [notes, setNotes] = useState<any[]>();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      router.replace('/');
    }

    // Get user notes from appwrite
    appwrite.database.listDocuments('6264e8786fcd928527b6').then((notes) => {
      console.log(notes);
      setNotes(notes.documents);
      setLoading(false);
    });
  }, [router]);

  async function logout() {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      setLoading(true);
      await appwrite.account.deleteSession('current');
      localStorage.removeItem('user');
      router.replace('/');
      setLoading(false);
    }
  }
  return (
    <>
      <Head>
        <title>Papirus</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Container my={20}>
        <Stack>
          <Group position="apart">
            <Button leftIcon={<Note />}>New Note</Button>
            <Menu
              control={
                <ActionIcon variant="outline" color="dark" size="lg">
                  <GridDots />
                </ActionIcon>
              }
            >
              <Menu.Label>Logged in as {user?.email}</Menu.Label>
              <Menu.Item
                color="red"
                icon={<Logout size={14} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Group>
          <Input icon={<Search />} placeholder="Search Notes" size="md" />
          {notes !== undefined ? <ListNote notes={notes} /> : null}
        </Stack>
      </Container>
    </>
  );
}
