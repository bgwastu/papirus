import {
  ActionIcon,
  Button,
  Container,
  Group,
  Kbd,
  LoadingOverlay,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip
} from '@mantine/core';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {formatRelative} from 'date-fns';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, DeviceFloppy, RotateClockwise, Trash} from 'tabler-icons-react';
import Navbar from '../components/Navbar';
import Note from '../interfaces/note';
import User from '../interfaces/user';
import {appwrite, Server} from '../stores/global';

const CustomDocument = Document.extend({
  content: 'heading block*',
});

export default function NoteDetailOwner({
  note: noteInit,
  user,
}: {
  note: Note;
  user: User;
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(() =>
    noteInit.$read.map((n) => n.includes('role:all')).includes(true)
  );
  const [note, setNote] = useState(noteInit);
  const editRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
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
    content: note.content,
  });
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

  useEffect(() => {
    if (
      note.$read.map((n) => n.includes('role:all')).includes(true) === isPublic
    )
      return;

    if (isPublic) {
      setLoading(true);
      appwrite.database
        .updateDocument(
          Server.collectionID,
          note.$id,
          note,
          [`user:${user.$id}`, 'role:all'],
          [`user:${user.$id}`]
        )
        .then((n: any) => setNote(n))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      appwrite.database
        .updateDocument(
          Server.collectionID,
          note.$id,
          note,
          [`user:${user.$id}`],
          [`user:${user.$id}`]
        )
        .then((n: any) => setNote(n))
        .finally(() => setLoading(false));
    }
  }, [isPublic, note, user, noteInit]);

  function update() {
    setEditing(!editing);

    // if there is no change, then return
    if (editor?.getHTML() === note.content) return;

    setLoading(true);
    // Push changes to the database
    appwrite.database
      .updateDocument(Server.collectionID, note.$id, {
        content: editor?.getHTML(),
        timestamp: Date.now(),
      })
      .then((res: any) => setNote(res))
      .finally(() => setLoading(false));
  }

  function deleteNote() {
    const confirmation = confirm('Are you sure you want to delete this note?');
    if (confirmation) {
      setLoading(true);
      appwrite.database
        .deleteDocument(Server.collectionID, note.$id)
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          router.push('/' + user.$id).then(() => {
            setLoading(false);
          });
        });
    }
  }

  function onBack(): void {
    if (editor?.getHTML() !== note.content) {
      const confirmation = confirm(
        'Are you sure you want to discard your changes?'
      );
      if (confirmation) {
        router.push('/' + user.$id);
      }
    } else {
      router.push('/' + user.$id);
    }
  }

  function resetChanges() {
    if (confirm('Are you sure you want to discard your changes?')) {
      editor?.commands.setContent(note.content);
    }
  }

  function getTitle() {
    const doc = new DOMParser().parseFromString(note.content, 'text/html');
    return doc.getElementsByTagName('h1')[0].innerHTML;
  }

  return (
    <>
      <Head>
        <title>{getTitle()}</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Container my={20}>
        <Stack>
          <Navbar
            leading={
              <>
                <Button
                  leftIcon={<ArrowLeft />}
                  onClick={() => onBack()}
                  variant="default"
                >
                  Back
                </Button>
              </>
            }
            menu={
              <>
                <Tooltip
                  label="Reset changes"
                  withArrow
                  position="bottom"
                  style={{
                    visibility:
                      editor !== null
                        ? editor?.getHTML() === note.content
                          ? 'hidden'
                          : 'visible'
                        : 'hidden',
                  }}
                >
                  <ActionIcon
                    onClick={resetChanges}
                    size="lg"
                    variant="default"
                  >
                    <RotateClockwise />
                  </ActionIcon>
                </Tooltip>
                {editor != null ? (
                  editor?.getHTML() !== note.content ? (
                    <Button
                      leftIcon={<DeviceFloppy />}
                      onClick={update}
                      disabled={editor?.getText().length === 0 ?? false}
                    >
                      Update
                    </Button>
                  ) : null
                ) : null}
                <Tooltip label="Delete note" withArrow>
                  <ActionIcon
                    onClick={deleteNote}
                    size="lg"
                    color="red"
                    variant="outline"
                  >
                    <Trash />
                  </ActionIcon>
                </Tooltip>
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
              <Kbd>{isPublic ? 'Public' : 'Private'}</Kbd>
              <Tooltip label="Make the page public" withArrow position="bottom">
                <Switch
                  size="md"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.currentTarget.checked)}
                />
              </Tooltip>
            </Group>
          </Group>
          <Paper shadow="xs" px="md" pb="md" withBorder>
            <EditorContent editor={editor} />
            <Text color="dimmed" hidden={isContentEmpty()} ref={editRef}>
              <Kbd>⏎</Kbd> to add note content
            </Text>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
