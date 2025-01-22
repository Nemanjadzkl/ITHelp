// src/utils/taskStorage.ts
import fs from 'fs';
import path from 'path';

const tasksPath = path.join(process.cwd(), 'public', 'tasks.json');

export const readTasks = (): any => {
  try {
    const data = fs.readFileSync(tasksPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const writeTasks = (tasks: any) => {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2), 'utf8');
};