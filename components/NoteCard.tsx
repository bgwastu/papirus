import {Button, Group, Paper, Space, Spoiler, Text} from '@mantine/core';
import {formatRelative} from 'date-fns';
import Link from 'next/link';

export default function NoteCard({ note }: { note: any }) {
  return (
    <Paper shadow="xs" p="md">
      <Group position="apart">
        <Text color="dimmed">
          {formatRelative(new Date(note.timestamp), new Date())}
        </Text>
        <Link href={`${window.location.href}/${note.$id}`} passHref>
          <Button variant="default">Detail</Button>
        </Link>
      </Group>

      <Spoiler maxHeight={220} hideLabel="Hide" showLabel="Show more">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        <Space h={2} />
      </Spoiler>
    </Paper>
  );
}
