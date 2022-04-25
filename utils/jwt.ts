import { appwrite } from '../stores/global';

export async function getJWT(): Promise<string> {
  const jwt = window!.localStorage.getItem('jwt');
  const jwtExpires = +window.localStorage.getItem('jwt_expires')!;
  if (jwt && jwtExpires > Date.now()) {
    return jwt;
  } else {
    try {
      setJWT((await appwrite.account.createJWT()).jwt);
      return await getJWT();
    } catch (error) {
      return '';
    }
  }
}
export function setJWT(jwt: string) {
  const jwtExpires = Date.now() + 15 * 60 * 1000;
  window?.localStorage.setItem('jwt', jwt);
  window?.localStorage.setItem('jwt_expires', jwtExpires.toString());
}
