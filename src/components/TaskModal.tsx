import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { X, Send, Trash2 } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: '',
      details: '',
      status: 'open',
      assignee: 'aleksandar',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      comments: [],
    }
  );

  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          id: Date.now().toString(),
          text: newComment,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {task ? 'Измени задатак' : 'Нови задатак'}
          </h2>
          <div className="flex items-center gap-2">
            {task && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-colors"
                title="Обриши задатак"
              >
                <Trash2 />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Наслов</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Детаљи</label>
            <textarea
              value={formData.details}
              onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="open">Отворен</option>
                <option value="inProgress">У току</option>
                <option value="closed">Затворен</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Задужен</label>
              <select
                value={formData.assignee}
                onChange={e => setFormData(prev => ({ ...prev, assignee: e.target.value as Task['assignee'] }))}
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="aleksandar">Александар Ј.</option>
                <option value="nemanjaDz">Немања Џ.</option>
                <option value="nemanjaT">Немања Т.</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Приоритет</label>
              <select
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="low">Низак</option>
                <option value="medium">Средњи</option>
                <option value="high">Висок</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Рок</label>
              <input
                type="date"
                value={formData.dueDate?.split('T')[0]}
                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          {task && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Коментари ({formData.comments?.length || 0})
              </label>
              <div className="space-y-4 mb-4">
                {formData.comments?.map(comment => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm">{comment.text}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString('sr-RS')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Додај коментар..."
                  className="flex-1 bg-gray-800 rounded-lg p-2 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="p-2 bg-primary rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Откажи
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Сачувај
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};