// api/tasks/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Решавање проблема са __dirname у ES модулима
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Путања до tasks.json
    const tasksPath = path.join(__dirname, '..', '..', 'public', 'tasks.json');
    
    // Провера да ли фајл постоји
    if (!fs.existsSync(tasksPath)) {
      fs.writeFileSync(tasksPath, '[]', 'utf8');
    }

    // CORS хедери
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      const data = fs.readFileSync(tasksPath, 'utf8');
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      fs.writeFileSync(tasksPath, JSON.stringify(req.body, null, 2));
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}