import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  Input,
  LoadingOverlay,
  Menu,
  Pagination,
  Stack,
} from '@mantine/core';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GridDots, Logout, Note, Search } from 'tabler-icons-react';
import ListNote from '../../components/ListNote';
import { appwrite } from '../../stores/global';

const PAGE_LIMIT = 25;
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [notes, setNotes] = useState<any[]>();

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj);

      // check userId is match user id from user
      const { userId } = router.query;
      if (userId !== userObj.$id) {
        router.push('/');
      }
    } else {
      router.replace('/');
    }

    // Get user notes from appwrite
    appwrite.database
      .listDocuments(
        '6264e8786fcd928527b6',
        [],
        PAGE_LIMIT,
        PAGE_LIMIT * (currentPage - 1)
      )
      .then((res) => {
        console.log(res);

        // Set totalPage
        setTotalPage(res.total / PAGE_LIMIT);

        setNotes(res.documents);
        setLoading(false);
      });
  }, [currentPage, router]);

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
          {notes !== undefined || totalPage !== 0 ? (
            <Center>
              <Pagination
                total={totalPage}
                onChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Center>
          ) : null}
        </Stack>
      </Container>
    </>
  );
}
