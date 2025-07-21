import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { Rocket } from 'lucide-react';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function InProgressTasks({ tasks, onTaskClick }: Props) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <Rocket className="text-accent" />
        In Progress
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
}
