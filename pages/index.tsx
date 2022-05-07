import {
  Anchor,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  LoadingOverlay,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Login, UserPlus } from 'tabler-icons-react';
import useUser from '../hooks/useUser';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 120,
    paddingBottom: 80,

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    '@media (max-width: 520px)': {
      height: 42,
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export default function Landing() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user] = useUser();

  useEffect(() => {
    if (!router.isReady) return;
    // Check if user is already logged in from localStorage
    if (user) {
      router.replace('/' + user.$id).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Papirus</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Container className={classes.wrapper} size={1400}>
        <div className={classes.inner}>
          <Group position="center">
            <Image
              src="/papirus.png"
              height={60}
              width={60}
              alt="papirus logo"
            />
          </Group>
          <Title className={classes.title}>
            Write & share your snippets never been easier
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" color="dimmed" className={classes.description}>
              Write and share your code, notes and snippets without much
              friction.
              {<br />}Built for you who like simplicity.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button
              className={classes.control}
              size="lg"
              variant="outline"
              leftIcon={<Login />}
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button
              className={classes.control}
              size="lg"
              leftIcon={<UserPlus />}
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </div>
        </div>
        <Center mt="xl">
          <Text color="dimmed">
            Built with Next {'&'} Appwrite.{' '}
            <Anchor
              href="https://github.com/bagaswastu/papirus"
              target="_blank"
            >
              Source code
            </Anchor>
          </Text>
        </Center>
      </Container>
    </>
  );
}
