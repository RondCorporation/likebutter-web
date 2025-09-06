import { Task } from '@/types/task';
import ButterCoverDetailsView from './butter-cover/ButterCoverDetailsView';

export default function TaskDetailsView({ task }: { task: Task }) {
  switch (task.actionType) {
    case 'BUTTER_COVER':
      return <ButterCoverDetailsView details={task.details} />;
    case 'DIGITAL_GOODS':
    case 'DREAM_CONTI':
    case 'FANMEETING_STUDIO':
    case 'PHOTO_EDITOR':
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Task Details</h3>
          <div className="space-y-2">
            <div><span className="text-slate-400">Task ID:</span> <span className="text-white">{task.taskId}</span></div>
            <div><span className="text-slate-400">Status:</span> <span className="text-white">{task.status}</span></div>
            <div><span className="text-slate-400">Created:</span> <span className="text-white">{new Date(task.createdAt).toLocaleString()}</span></div>
            <div><span className="text-slate-400">Type:</span> <span className="text-white">{task.actionType}</span></div>
          </div>
          {task.details && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium text-slate-300">Request Details</h4>
              <pre className="overflow-auto rounded bg-slate-800 p-3 text-xs text-slate-300">
                {JSON.stringify(task.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    default:
      const exhaustiveCheck: never = task;
      return <p>Details for this task type are not available.</p>;
  }
}
