import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function CompletedTasks({ tasks, onTaskClick }: Props) {
  const { t } = useTranslation();
  if (tasks.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <CheckCircle className="text-slate-400" />
        {t('historyTitle')}
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
