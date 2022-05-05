import { Button, Group, Kbd, Paper, Space, Spoiler, Text } from '@mantine/core';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import Note from '../interfaces/note';

export default function NoteCard({ note }: { note: Note }) {
  const isPublic = note.$read.map((n) => n.includes('role:all')).includes(true);
  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group position="apart">
        <Group>
          <Text color="dimmed">
            {formatRelative(new Date(note.timestamp), new Date())}
          </Text>
          <Kbd>{isPublic ? 'Public' : 'Private'}</Kbd>
        </Group>
        <Link href={`${window.location.href}/${note.$id}`} passHref>
          <Button variant="default">Detail</Button>
        </Link>
      </Group>

      <Spoiler maxHeight={300} hideLabel="Hide" showLabel="Show more">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        <Space h={2} />
      </Spoiler>
    </Paper>
  );
}
