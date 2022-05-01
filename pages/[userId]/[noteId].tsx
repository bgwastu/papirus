import {
  LoadingOverlay
} from '@mantine/core';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import Note from '../../interfaces/note';
import NoteDetailOwner from '../../screens/NoteDetailOwner';
import NoteDetailPublic from '../../screens/NoteDetailPublic';
import { appwrite, Server } from '../../stores/global';

export default function NoteDetail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    if (!router.isReady) return;
    // If the user is not logged in, then check if the note id is public.
    const { noteId } = router.query;
    if (note === undefined) {
      setLoading(true);
      appwrite.database
        .getDocument(Server.collectionID, noteId as string)
        .then((res: any) => setNote(res)) // If the note is public or user have permission, then set the note.
        .catch((_) => router.push('/')) // If the note is not public, then redirect to home.
        .finally(() => setLoading(false));
    }

  }, [router, note]);

  return (
    <>
      <LoadingOverlay visible={loading} />
      {note !== undefined ? (
        user !== undefined &&
        note.$read.map((n) => n.includes(user.$id)).includes(true) ? (
          <NoteDetailOwner user={user} note={note} />
        ) : (
          <NoteDetailPublic note={note} />
        )
      ) : null}
    </>
  );
}
