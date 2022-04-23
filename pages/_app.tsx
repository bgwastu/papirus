import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'dark',
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
