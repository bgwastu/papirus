import { useEffect, useState } from 'react';
import User from '../interfaces/user';

const KEY = 'user';
export default function useUser(): [
  User | undefined,
  (user: User | undefined) => void
] {
  const [user, setUser] = useState<User | undefined>(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
  });

  useEffect(() => {
    if (user === undefined) {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, JSON.stringify(user));
    }
  }, [user]);

  return [user, setUser];
}
