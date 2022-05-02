import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useUser from '../hooks/useUser';
import { appwrite } from '../stores/global';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
  const [user, setUser] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Check account using JWT
    appwrite.account.get().catch(() => {
      setUser(undefined);
      router.replace('/');
    });

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
  }, [router, setUser, user]);

  return <>{props.children}</>;
}
