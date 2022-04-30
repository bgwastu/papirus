import { LoadingOverlay } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useUser from '../hooks/useUser';
import { appwrite } from '../stores/global';

export default function Check() {
  const router = useRouter();
  const [_, setUser] = useUser();

  useEffect(() => {
    // Get the user form appwrite, save it to local storage then redirect to the dashboard
    appwrite.account
      .get()
      .then((user) => {
        setUser(user);
        router.replace('/' + user.$id);
      })
      .catch((error) => {
        console.log(error);
        setUser(undefined);
        router.replace('/');
      });
  }, [router, setUser]);

  return (
    <>
      <Head>
        <title>Checking...</title>
      </Head>
      <LoadingOverlay visible></LoadingOverlay>
    </>
  );
}
