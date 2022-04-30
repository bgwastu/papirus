import {
  Button,
  Center,
  Container,
  Input,
  LoadingOverlay,
  Pagination,
  Stack
} from '@mantine/core';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Note, Search } from 'tabler-icons-react';
import AuthProvider from '../../components/AuthProvider';
import ListNote from '../../components/ListNote';
import MenuButton from '../../components/MenuButton';
import Navbar from '../../components/Navbar';
import useUser from '../../hooks/useUser';
import { appwrite } from '../../stores/global';

const PAGE_LIMIT = 25;
export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useUser();

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
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
        setTotalPage(Math.ceil(res.total / PAGE_LIMIT));
        setNotes(res.documents);
      })
      .finally(() => {
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
    <AuthProvider>
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
                onClick={() => router.push(user?.$id + '/new')}
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
    </AuthProvider>
  );
}
