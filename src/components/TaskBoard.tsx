import React, { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, List, LayoutGrid } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasks, 
  onTaskClick, 
  onAddTask
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const columns = [
    { id: 'open' as const, title: 'Отворен', color: '#EF4444' },
    { id: 'inProgress' as const, title: 'У току', color: '#EAB308' },
    { id: 'closed' as const, title: 'Затворен', color: '#22C55E' },
  ];

  if (viewMode === 'kanban') {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded hover:bg-gray-700 transition-colors"
            >
              <List />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className="p-2 rounded bg-primary bg-opacity-20 text-primary"
            >
              <LayoutGrid />
            </button>
          </div>
          
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Plus size={20} />
            <span>Нови задатак</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div
              key={column.id}
              className="rounded-lg backdrop-blur-md bg-surface bg-opacity-30 p-4"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                {column.title}
              </h2>
              
              <div className="space-y-4">
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 rounded bg-primary bg-opacity-20 text-primary"
          >
            <List />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
          >
            <LayoutGrid />
          </button>
        </div>
        
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus size={20} />
          <span>Нови задатак</span>
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
};