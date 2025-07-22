import { Task } from '@/types/task';
import ButterGenTaskCard from './butter-gen/ButterGenTaskCard';
import ButterTestTaskCard from './butter-test/ButterTestTaskCard';

interface Props {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: Props) {
  switch (task.actionType) {
    case 'BUTTER_GEN':
      return <ButterGenTaskCard task={task} onClick={onClick} />;
    case 'BUTTER_TEST':
      return <ButterTestTaskCard task={task} onClick={onClick} />;
    default:
      const exhaustiveCheck: never = task;
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p>Unknown Task Type</p>
        </div>
      );
  }
}
