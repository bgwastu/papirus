import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import '../styles/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'dark',
      }}
      withNormalizeCSS
      withGlobalStyles
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
