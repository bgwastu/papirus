import {
  ActionIcon,
  Button,
  Container,
  Kbd,
  LoadingOverlay,
  Paper,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import 'highlight.js/styles/github-dark.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ArrowLeft, DeviceFloppy, Markdown } from 'tabler-icons-react';
import AuthProvider from '../../components/AuthProvider';
import Navbar from '../../components/Navbar';
import useUser from '../../hooks/useUser';
import { getJWT } from '../../utils/jwt';

const CustomDocument = Document.extend({
  content: 'heading block*',
});

export default function NewNote() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useUser();
  const [openedInfo, setOpenedInfo] = useState(false);

  useHotkeys([
    [
      'ctrl+s',
      () => {
        save();
      },
    ],
  ]);

  const editor = useEditor({
    autofocus: true,
    extensions: [
      CustomDocument,
      Link,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          return (
            node.type.name.charAt(0).toUpperCase() + node.type.name.slice(1)
          );
        },
      }),
    ],
  });

  function onBack() {
    if (editor) {
      if (editor.getText().length > 0) {
        const confirmation = confirm(
          'Are you sure you want to leave this page? Any unsaved changes will be lost.'
        );
        if (confirmation) {
          router.replace('/' + user?.$id);
        }
      } else {
        router.replace('/' + user?.$id);
      }
    }
  }

  async function save() {
    if (!editor) return;
    if (editor.getText().length > 0) {
      setLoading(true);
      const jwt = await getJWT();
      const content = editor.getHTML();

      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content,
          text: editor.getText(),
          timestamp: Date.now(),
          userId: user?.$id,
        }),
      })
        .then((res) => {
          // If unauthorized, then logout
          if (res.status === 401) {
            setUser(undefined);
            router.replace('/');
          }

          res.json().then((data) => {
            router.replace('/' + user?.$id + '/' + data.$id);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const isContentEmpty = () => {
    if (editor !== null) {
      if (editor.getJSON().content != null) {
        return editor!.getJSON().content!.length > 1;
      } else {
        return true;
      }
    }
    return true;
  };

  return (
    <AuthProvider>
      <Head>
        <title>New Note</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Container my={20}>
        <Stack>
          <Navbar
            leading={
              <Button
                leftIcon={<ArrowLeft />}
                onClick={() => onBack()}
                variant="default"
              >
                Back
              </Button>
            }
            menu={
              <>
                <Popover
                  opened={openedInfo}
                  onClose={() => setOpenedInfo(false)}
                  target={
                    <ActionIcon onClick={() => setOpenedInfo(!openedInfo)}>
                      <Markdown />
                    </ActionIcon>
                  }
                  width={260}
                  position="bottom"
                  withArrow
                >
                  <Stack>
                    <Text size="sm">
                      Papirus has excellent support for markdown just like
                      Notion. Try it out!
                    </Text>
                  </Stack>
                </Popover>
                <Button
                  key="save"
                  leftIcon={<DeviceFloppy />}
                  onClick={save}
                  disabled={editor?.getText().length === 0 ?? false}
                >
                  Save (ctrl+s)
                </Button>
              </>
            }
          />
          <Paper
            shadow="xs"
            px="md"
            pb="md"
            style={{ minHeight: '300px' }}
            withBorder
          >
            <EditorContent editor={editor} />
            <Text color="dimmed" hidden={isContentEmpty()}>
              <Kbd>⏎</Kbd> to add note content
            </Text>
          </Paper>
        </Stack>
      </Container>
    </AuthProvider>
  );
}
