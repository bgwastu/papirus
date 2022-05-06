import {
  Button,
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
import { BrandGithub } from 'tabler-icons-react';
import useUser from '../hooks/useUser';
import { appwrite } from '../stores/global';

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

  async function oAuthLogin(provider: string) {
    // check if window is available
    if (typeof window === 'undefined') return;

    const baseUrl = window.location.origin;
    appwrite.account.createOAuth2Session(provider, baseUrl + '/check');
  }

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
            Write & share your{' '}
            <Text component="span" color={theme.colors.yellow[5]} inherit>
              snippets
            </Text>{' '}
            never been easier
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
              leftIcon={<BrandGithub />}
              onClick={() => oAuthLogin('github')}
            >
              Login with GitHub
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
