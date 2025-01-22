import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';

const tasksPath = path.join(process.cwd(), 'public', 'tasks.json');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Аутоматско креирање фајла ако не постоји
    await fs.access(tasksPath).catch(async () => {
      await fs.writeFile(tasksPath, '[]', 'utf8');
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      const data = await fs.readFile(tasksPath, 'utf8');
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      await fs.writeFile(tasksPath, JSON.stringify(req.body, null, 2));
      return res.status(200).json({ success: true });
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}