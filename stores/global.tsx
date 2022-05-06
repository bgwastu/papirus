import { Appwrite } from 'appwrite';

export const Server = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_APP_ENDPOINT || '',
  project: process.env.NEXT_PUBLIC_APPWRITE_APP_PROJECT || '',
  collectionID: process.env.NEXT_PUBLIC_APPWRITE_APP_COLLECTION_ID || '',
  key: process.env.APPWRITE_KEY || '',
};

export const appwrite = new Appwrite()
  .setEndpoint(Server.endpoint!)
  .setProject(Server.project!);

export const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
