import { LoadingOverlay } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { appwrite } from '../stores/global';

export default function Check() {
  const router = useRouter();
  useEffect(() => {
    // Get the user form appwrite, save it to local storage then redirect to the dashboard
    appwrite.account
      .get()
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        router.replace('/' + user.$id);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem('user');
        router.push('/');
      });
  }, [router]);

  return (
    <>
      <Head>
        <title>Checking...</title>
      </Head>
      <LoadingOverlay visible></LoadingOverlay>
    </>
  );
}
