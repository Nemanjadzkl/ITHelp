// src/pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { readTasks, writeTasks } from '../../utils/taskStorage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tasks = readTasks();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    writeTasks(req.body);
    res.status(200).json({ message: 'Tasks updated' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}