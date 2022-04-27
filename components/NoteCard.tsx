import { Button, Group, Paper, Spoiler, Text } from '@mantine/core';
import Link from 'next/link';
import Highlight from 'react-highlight';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

export default function NoteCard({ note }: { note: any }) {
  return (
    <Paper shadow="xs" p="md">
      <Group position="apart">
        <Text color="dimmed">
          {formatRelative(new Date(note.timestamp * 1000), new Date())}
        </Text>
        <Link href={`${window.location.href}/${note.$id}`} passHref>
          <Button variant="default">Detail</Button>
        </Link>
      </Group>

      <Spoiler maxHeight={310} hideLabel="Hide" showLabel="Show more">
        <Highlight className="content" innerHTML={true}>
          {note.content}
        </Highlight>
      </Spoiler>
    </Paper>
  );
}
