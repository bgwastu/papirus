import DOMPurify from 'isomorphic-dompurify';
import { NextApiRequest, NextApiResponse } from 'next';
import { appwrite, Server } from '../../stores/global';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get JWT from authorization bearer token
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    const jwt = req.headers.authorization?.split(' ')[1];

    if (!jwt) {
      res.status(401).send('Unauthorized');
      return;
    }

    // data
    const { content, timestamp } = req.body;
    if (!content || !timestamp) {
      res.status(400).send('Bad Request');
      return;
    }

    // Make sure the html is safe
    const cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    });

    if (cleanContent.trim() === '') {
      res.status(400).send('Bad Request');
      return;
    }

    appwrite.setJWT(jwt);
    appwrite.database
      .createDocument(Server.collectionID, 'unique()', {
        content: cleanContent,
        timestamp,
      })
      .then((data) => res.json(data))
      .catch((err) => res.status(500).send(err));
  }
}
