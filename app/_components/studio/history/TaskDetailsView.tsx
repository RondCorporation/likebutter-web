import { Task } from '@/types/task';
import ButterGenDetailsView from './butter-gen/ButterGenDetailsView';
import ButterTestDetailsView from './butter-test/ButterTestDetailsView';

export default function TaskDetailsView({ task }: { task: Task }) {
  switch (task.actionType) {
    case 'BUTTER_GEN':
      return <ButterGenDetailsView details={task.details} />;
    case 'BUTTER_TEST':
      return <ButterTestDetailsView details={task.details} />;
    default:
      const exhaustiveCheck: never = task;
      return <p>Details for this task type are not available.</p>;
  }
}
