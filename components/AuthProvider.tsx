import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useUser from '../hooks/useUser';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
  const [user] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (user) {
      // Push to dashboard if userId not match user id from user
      const { userId } = router.query;
      if (userId !== user.$id) {
        router.push('/');
      }
    } else {
      console.log('User not found');
      router.replace('/');
    }
  }, [router, user]);

  return <>{props.children}</>;
}
