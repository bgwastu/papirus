import {Center, Grid, Text} from '@mantine/core';
import Note from '../interfaces/note';
import NoteCard from './NoteCard';

export default function ListNote({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <Center>
        <Text color="dimmed">No notes found 📝</Text>
      </Center>
    );
  }

  return (
    <Grid align="flex-start">
      {notes?.map((note) => {
        return (
          <Grid.Col key={note.$id} sm={6} xs={12}>
            <NoteCard note={note} />
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
