import { NextApiRequest, NextApiResponse } from 'next';
import sdk from 'node-appwrite';
import { Server } from '../../stores/global';
import { faker } from '@faker-js/faker';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // admin appwrite

    // If production, then return error
    if (process.env.NODE_ENV !== 'development') {
      return res.status(500).json({
        message: 'API is not for production',
      });
    }

    const client = new sdk.Client();

    client
      .setEndpoint(Server.endpoint || '') // Your API Endpoint
      .setProject(Server.project || '') // Your project ID
      .setKey(Server.key || '') // Your secret API key
      .setSelfSigned(); // Use only on dev mode with a self-signed SSL cert

    // Get first user
    const users = new sdk.Users(client);
    const user = (await users.list()).users[0];

    // Add list of notes to the appwrite
    const db = new sdk.Database(client);

    // clear all notes
    const documentIds = (
      await db.listDocuments(Server.collectionID || '')
    ).documents.map((e) => e.$id);
    for (const id of documentIds) {
      console.log(id);
      await db.deleteDocument(Server.collectionID || '', id);
    }

    // Add new ones
    for (let i = 0; i < 50; i++) {
      const title = faker.lorem.words();
      const content = `
        <h1>${title}</h1>
        <p>${faker.lorem.paragraphs()}</p>
        <pre><code class="language-javascript">console.log("Hello world");</code></pre>
        <p>${faker.lorem.paragraphs()}</p>
      `;
      db.createDocument(
        Server.collectionID || '',
        'unique()',
        {
          content,
          timestamp: Date.now(),
        },
        [`user:${user.$id}`],
        [`user:${user.$id}`]
      );
    }
    return res.status(200).json({ message: 'success' });
  }

  return res.status(404).json({ statusCode: 404, message: 'Not Found' });
}
