import { Task } from '@/types/task';
import { X } from 'lucide-react';
import TaskDetailsView from './TaskDetailsView';

interface Props {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailsModal({ task, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-neutral-900 border border-white/10 text-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            Task Details (ID: {task.taskId})
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <TaskDetailsView task={task} />
        </div>
      </div>
    </div>
  );
}
