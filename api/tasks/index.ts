import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';

const tasksPath = path.join(process.cwd(), 'public', 'tasks.json');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Креирај фајл ако не постоји
    await fs.access(tasksPath).catch(async () => {
      await fs.writeFile(tasksPath, '[]');
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      const data = await fs.readFile(tasksPath, 'utf8');
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      await fs.writeFile(tasksPath, JSON.stringify(req.body));
      return res.status(200).json({ success: true });
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}