import { Task } from '@/types/task';
import { memo } from 'react';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Music } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'BUTTER_COVER' };
  onClick: () => void;
}

const ButterCoverTaskCard = memo(({ task, onClick }: Props) => {
  const { t } = useTranslation();
  const result = task.butterCover;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">AI Voice Cover</h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Result Info */}
      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Music className="h-4 w-4" />
            <span>AI voice cover completed successfully</span>
          </div>
          {result.filename && (
            <div className="mt-2 text-xs text-slate-400 truncate">
              {result.filename}
            </div>
          )}
        </div>
      )}

      {/* Coming Soon Notice */}
      {task.status === 'PENDING' && (
        <div className="mt-3 rounded bg-butter-yellow/20 p-2 text-sm text-butter-yellow">
          Feature coming soon
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
});

ButterCoverTaskCard.displayName = 'ButterCoverTaskCard';

export default ButterCoverTaskCard;
