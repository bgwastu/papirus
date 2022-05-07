import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { appwrite } from '../stores/global';

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      password: (value: string) =>
        value.length > 8 ? null : 'Password must be at least 8 characters',
    },
  });

  function login(data: FormData) {
    setLoading(true);
    appwrite.account
      .createSession(data.email, data.password)
      .then((s) => {
        s.userId && router.push('/check').finally(() => setLoading(false));
      })
      .catch((e: any) => {
        setLoading(false);
        showNotification({
          title: 'Error',
          message: e.message,
        });
      });
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Container size={420} my={40}>
        <Center>
          <ActionIcon size={50} onClick={() => router.push('/')}>
            <Image
              src="/papirus.png"
              width={50}
              height={50}
              alt="papirus logo"
            />
          </ActionIcon>
        </Center>
        <Title
          align="center"
          sx={(theme) => ({
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{' '}
          <Link href="/register">Create account</Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(login)}>
            <TextInput
              label="Email"
              placeholder="you@email.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps('password')}
            />
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
