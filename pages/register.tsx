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
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      name: (value: string) => (value.length > 0 ? null : 'Name is required'),
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      password: (value: string) =>
        value.length > 8 ? null : 'Password must be at least 8 characters',
      passwordConfirm: (value: string) => {
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (value !== form.values.password) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
  });

  function register(data: FormData) {
    setLoading(true);
    appwrite.account
      .create('unique()', data.email, data.password, data.name)
      .then((s) => {
        appwrite.account
          .createSession(data.email, data.password)
          .then((s) => {
            router.push('/check').finally(() => setLoading(false));
          })
          .catch((e: any) => {
            setLoading(false);
            showNotification({
              title: 'Error',
              message: e.message,
            });
          });
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
        <title>Register</title>
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
          Sign up to Papirus
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account? <Link href="/login">Sign in</Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(register)}>
            <TextInput
              label="Name"
              placeholder="Your Name"
              mt="md"
              required
              autoFocus
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="you@email.com"
              mt="md"
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
            <PasswordInput
              label="Password Confirm"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps('passwordConfirm')}
            />
            <Button fullWidth mt="xl" type="submit">
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
