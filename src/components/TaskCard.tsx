import React from 'react';
import { Task } from '../types';
import { Calendar, MessageCircle, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'open': return 'bg-red-500/30';
      case 'inProgress': return 'bg-yellow-500/30';
      case 'closed': return 'bg-green-500/30';
    }
  };

  const getStatusTextColor = (status: Task['status']) => {
    switch (status) {
      case 'open': return 'text-red-400';
      case 'inProgress': return 'text-yellow-400';
      case 'closed': return 'text-green-400';
    }
  };

  const getAssigneeColor = (assignee: Task['assignee']) => {
    switch (assignee) {
      case 'aleksandar': return '#BB86FC';
      case 'nemanjaDz': return '#03DAC6';
      case 'nemanjaT': return '#CF6679';
    }
  };

  const getAssigneeName = (assignee: Task['assignee']) => {
    switch (assignee) {
      case 'aleksandar': return 'Александар Ј.';
      case 'nemanjaDz': return 'Немања Џ.';
      case 'nemanjaT': return 'Немања Т.';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative p-4 rounded-lg backdrop-blur-md hover:transform hover:scale-102 transition-all duration-300 cursor-pointer ${getStatusColor(task.status)}`}
      style={{
        borderLeft: `4px solid ${getAssigneeColor(task.assignee)}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full" 
          style={{ 
            backgroundColor: `${getAssigneeColor(task.assignee)}30`,
            color: getAssigneeColor(task.assignee)
          }}
        >
          <User size={16} />
          <span className="font-medium">{getAssigneeName(task.assignee)}</span>
        </div>
      </div>
      
      <p className="text-white text-sm mb-4 line-clamp-2">{task.details}</p>
      
      <div className="flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(task.dueDate).toLocaleDateString('sr-RS')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span>{task.comments.length}</span>
          </div>
        </div>
        <span className={`font-medium ${getStatusTextColor(task.status)}`}>
          {task.status === 'open' ? 'Отворен' : task.status === 'inProgress' ? 'У току' : 'Затворен'}
        </span>
      </div>
    </div>
  );
};