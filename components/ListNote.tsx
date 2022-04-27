import { Center, Paper, SimpleGrid, Spoiler, Text } from '@mantine/core';
import NoteCard from './NoteCard';

export default function ListNote({notes}: {notes: any[]}) {
  if (notes.length === 0) {
    return (
      <Center>
        <Text color='dimmed'>No notes found 📝</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 'sm', cols: 2, spacing: 'sm' },
        { maxWidth: 'xs', cols: 1, spacing: 'sm' },
      ]}
    >
      {notes?.map((note) => {
        return <NoteCard key={note.$id} note={note} />;
      })}
    </SimpleGrid>
  );
}
