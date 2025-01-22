import React from 'react';
import { Filter, X } from 'lucide-react';
import { Task } from '../types';

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilters) => void;
  filters: TaskFilters;
  onReset: () => void;
}

export interface TaskFilters {
  status: Task['status'][];
  priority: Task['priority'][];
  assignee: Task['assignee'][];
  dueDateRange: {
    start: string;
    end: string;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  filters,
  onReset,
}) => {
  const handleStatusToggle = (status: Task['status']) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatuses });
  };

  const handlePriorityToggle = (priority: Task['priority']) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    onFilterChange({ ...filters, priority: newPriorities });
  };

  const handleAssigneeToggle = (assignee: Task['assignee']) => {
    const newAssignees = filters.assignee.includes(assignee)
      ? filters.assignee.filter(a => a !== assignee)
      : [...filters.assignee, assignee];
    onFilterChange({ ...filters, assignee: newAssignees });
  };

  return (
    <div className="bg-surface bg-opacity-30 backdrop-blur-md border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="font-semibold">Филтери</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
        >
          <X size={16} />
          Ресетуј
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Статус</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'open', label: 'Отворен', color: 'bg-red-500/20 text-red-400' },
              { value: 'inProgress', label: 'У току', color: 'bg-yellow-500/20 text-yellow-400' },
              { value: 'closed', label: 'Затворен', color: 'bg-green-500/20 text-green-400' },
            ].map(status => (
              <button
                key={status.value}
                onClick={() => handleStatusToggle(status.value as Task['status'])}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  status.color
                } ${
                  filters.status.includes(status.value as Task['status'])
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                    : ''
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Приоритет</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'high', label: 'Висок', color: 'bg-red-500/20 text-red-400' },
              { value: 'medium', label: 'Средњи', color: 'bg-yellow-500/20 text-yellow-400' },
              { value: 'low', label: 'Низак', color: 'bg-green-500/20 text-green-400' },
            ].map(priority => (
              <button
                key={priority.value}
                onClick={() => handlePriorityToggle(priority.value as Task['priority'])}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  priority.color
                } ${
                  filters.priority.includes(priority.value as Task['priority'])
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                    : ''
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Задужен</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'aleksandar', label: 'Александар Ј.', color: '#BB86FC' },
              { value: 'nemanjaDz', label: 'Немања Џ.', color: '#03DAC6' },
              { value: 'nemanjaT', label: 'Немања Т.', color: '#CF6679' },
            ].map(assignee => (
              <button
                key={assignee.value}
                onClick={() => handleAssigneeToggle(assignee.value as Task['assignee'])}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: `${assignee.color}20`,
                  color: assignee.color,
                  ...(filters.assignee.includes(assignee.value as Task['assignee'])
                    ? { boxShadow: `0 0 0 2px ${assignee.color}` }
                    : {}),
                }}
              >
                {assignee.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Период</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Од</label>
              <input
                type="date"
                value={filters.dueDateRange.start}
                onChange={e =>
                  onFilterChange({
                    ...filters,
                    dueDateRange: { ...filters.dueDateRange, start: e.target.value },
                  })
                }
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">До</label>
              <input
                type="date"
                value={filters.dueDateRange.end}
                onChange={e =>
                  onFilterChange({
                    ...filters,
                    dueDateRange: { ...filters.dueDateRange, end: e.target.value },
                  })
                }
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};