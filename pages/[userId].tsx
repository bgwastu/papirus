import { Button, LoadingOverlay, Text } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { appwrite } from '../stores/global';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function logout() {
    setLoading(true);
    await appwrite.account.deleteSession('current');
    localStorage.removeItem('user');
    router.replace('/');
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Papirus</title>
      </Head>
      <LoadingOverlay visible={loading} />
      <Text></Text>
      <Button onClick={() => logout()}>Logout</Button>
    </>
  );
}
