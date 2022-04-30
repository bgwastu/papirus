import {
  Button,
  Center,
  Container, Input,
  LoadingOverlay,
  Pagination,
  Stack
} from '@mantine/core';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Note, Search } from 'tabler-icons-react';
import ListNote from '../../components/ListNote';
import MenuButton from '../../components/MenuButton';
import Navbar from '../../components/Navbar';
import { appwrite } from '../../stores/global';

const PAGE_LIMIT = 25;
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [notes, setNotes] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj);

      // Push to dashboard if userId not match user id from user
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
        // Set totalPage
        setTotalPage(res.total / PAGE_LIMIT);
        setNotes(res.documents);
        setLoading(false);
      });
  }, [currentPage, router]);

  function logout() {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      setLoading(true);
      appwrite.account
        .deleteSession('current')
        .then(() => {
          localStorage.removeItem('user');
          router.replace('/');
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
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
          <Navbar
            leading={
              <Button
                leftIcon={<Note />}
                onClick={() => router.push(user.$id + '/new')}
              >
                New Note
              </Button>
            }
            menu={[
              <MenuButton key="menu" email={user?.email} onLogout={logout} />,
            ]}
          />
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
