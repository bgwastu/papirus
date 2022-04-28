import { Center, Grid, Paper, SimpleGrid, Spoiler, Text } from '@mantine/core';
import NoteCard from './NoteCard';

export default function ListNote({ notes }: { notes: any[] }) {
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
