import React, { useState, useEffect } from 'react';
import { Task } from './types';
import { TaskBoard } from './components/TaskBoard';
import { TaskModal } from './components/TaskModal';
import { Search, BarChart2, SortAsc, Filter, RefreshCw } from 'lucide-react';
import { TaskFilters, type TaskFilters as TaskFiltersType } from './components/TaskFilters';

const TASKS_API_URL = import.meta.env.DEV 
  ? 'http://localhost:3000/api/tasks' 
  : '/api/tasks';
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'status' | 'dueDate' | 'assignee'>('status');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: [],
    priority: [],
    assignee: [],
    dueDateRange: { start: '', end: '' },
  });

  const loadTasks = async () => {
    try {
      const response = await fetch(TASKS_API_URL);
      if (!response.ok) throw new Error('Error loading tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const updateTasks = async (newTasks: Task[]) => {
    try {
      await fetch(TASKS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTasks),
      });
      await loadTasks(); // Automatski osveži podatke nakon promene
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Polling za automatsko osvežavanje
  useEffect(() => {
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      const newTask: Task = selectedTask 
        ? { ...selectedTask, ...taskData }
        : {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            comments: [],
            ...taskData,
          } as Task;

      const newTasks = selectedTask
        ? tasks.map(t => t.id === selectedTask.id ? newTask : t)
        : [...tasks, newTask];

      await updateTasks(newTasks);
    } finally {
      setIsModalOpen(false);
      setSelectedTask(undefined);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Да ли сте сигурни да желите да обришете овај задатак?')) {
      const newTasks = tasks.filter(task => task.id !== taskId);
      await updateTasks(newTasks);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    await updateTasks(newTasks);
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: [],
      dueDateRange: { start: '', end: '' },
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesAssignee = filters.assignee.length === 0 || filters.assignee.includes(task.assignee);
    
    const matchesDateRange = 
      (!filters.dueDateRange.start || task.dueDate >= filters.dueDateRange.start) &&
      (!filters.dueDateRange.end || task.dueDate <= filters.dueDateRange.end);

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDateRange;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'status':
        const statusOrder = { open: 1, inProgress: 2, closed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'assignee':
        return a.assignee.localeCompare(b.assignee);
      default:
        return 0;
    }
  });

  const getStatusCount = (status: Task['status']) =>
    tasks.filter(t => t.status === status).length;

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="bg-surface bg-opacity-30 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Управљање задацима
            </h1>

            <div className="flex items-center gap-4">
              <button
                onClick={loadTasks}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCw size={20} />
                <span>Освежи податке</span>
              </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Претражи задатке..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="appearance-none pl-10 pr-8 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="status">По статусу</option>
                    <option value="dueDate">По датуму</option>
                    <option value="assignee">По задужењу</option>
                  </select>
                  <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors ${
                    showFilters ? 'bg-primary bg-opacity-20 border-primary' : ''
                  }`}
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4">
              <TaskFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface bg-opacity-30 backdrop-blur-md rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-red-500">
                <BarChart2 size={20} />
                <span>Отворени</span>
              </div>
              <p className="text-2xl font-bold mt-2">{getStatusCount('open')}</p>
            </div>

            <div className="bg-surface bg-opacity-30 backdrop-blur-md rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-yellow-500">
                <BarChart2 size={20} />
                <span>У току</span>
              </div>
              <p className="text-2xl font-bold mt-2">{getStatusCount('inProgress')}</p>
            </div>

            <div className="bg-surface bg-opacity-30 backdrop-blur-md rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-green-500">
                <BarChart2 size={20} />
                <span>Затворени</span>
              </div>
              <p className="text-2xl font-bold mt-2">{getStatusCount('closed')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <TaskBoard
          tasks={sortedTasks}
          onTaskClick={task => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          onAddTask={() => {
            setSelectedTask(undefined);
            setIsModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      </main>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(undefined);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;