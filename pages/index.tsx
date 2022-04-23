import { Text } from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Papirus Project</title>
      </Head>
      <div>
        <Image src={'/papirus.png'} alt="logo" height={100} width={100} />
        <Text>Hello Papirus!</Text>
      </div>
    </>
  );
};

export default Home;
