import {
  ActionIcon,
  Button,
  Center,
  Container,
  Input,
  LoadingOverlay,
  Pagination,
  Stack,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Query } from 'appwrite';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Note as NoteIcon, Search, X } from 'tabler-icons-react';
import AuthProvider from '../../components/AuthProvider';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle';
import ListNote from '../../components/ListNote';
import MenuButton from '../../components/MenuButton';
import Navbar from '../../components/Navbar';
import useUser from '../../hooks/useUser';
import Note from '../../interfaces/note';
import { appwrite } from '../../stores/global';

const PAGE_LIMIT = 25;
export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useUser();

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Search
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 400);

  var checkHTML = function (html: string) {
    var doc = document.createElement('div');
    doc.innerHTML = html;
    return doc.innerHTML === html;
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Get user notes from appwrite

    // Search
    const filteredQuery = debouncedQuery.replace('(', '').replace(')', '');
    const searchQuery =
      filteredQuery === '' ? [] : [Query.search('text', filteredQuery)];

    function highlight(text: string, query: string) {
      const queries = query.trim().split(' ');
      const regex = new RegExp(queries.join('|'), 'gi');
      const markedText = text.replace(
        regex,
        (match) => `<mark>${match}</mark>`
      );

      // check marked text is valid html, if not, return text
      if (!checkHTML(markedText)) {
        return text;
      }
      return markedText;
    }

    appwrite.database
      .listDocuments(
        '6264e8786fcd928527b6',
        searchQuery,
        PAGE_LIMIT,
        PAGE_LIMIT * (currentPage - 1),
        undefined,
        undefined,
        ['timestamp'],
        ['DESC']
      )
      .then((res: any) => {
        // Set totalPage
        setTotalPage(Math.ceil(res.total / PAGE_LIMIT));
        // Filter notes based on user id
        const filteredNotes = res.documents.filter((e: any) =>
          e.$read.map((r: any) => r.includes(user.$id)).includes(true)
        );
        // If user search for queries, then highlight part of the html
        if (filteredQuery !== '') {
          const highlightedNotes = filteredNotes.map((note: Note) => {
            return { ...note, content: highlight(note.content, filteredQuery) };
          });
          setNotes(highlightedNotes);
        } else {
          setNotes(filteredNotes);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, router, user, debouncedQuery]);

  function logout() {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      setLoading(true);
      appwrite.account
        .deleteSession('current')
        .then(() => {
          localStorage.removeItem('user');
          router.replace('/').then(() => setLoading(false));
        })
        .catch((e) => {
          console.log(e);
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
                leftIcon={<NoteIcon />}
                onClick={() => router.push(user?.$id + '/new')}
              >
                New Note
              </Button>
            }
            menu={
              <>
                <MenuButton email={user?.email} onLogout={logout} />
                <ColorSchemeToggle />
              </>
            }
          />
          <Input
            icon={<Search />}
            placeholder="Search Notes"
            size="md"
            onChange={(e: any) => setQuery(e.target.value)}
            value={query}
            rightSection={
              query !== '' ? (
                <ActionIcon onClick={() => setQuery('')} color="gray" size="sm">
                  <X />
                </ActionIcon>
              ) : null
            }
          />
          {notes !== undefined ? <ListNote notes={notes} /> : null}
          {notes !== undefined && totalPage > 1 ? (
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
