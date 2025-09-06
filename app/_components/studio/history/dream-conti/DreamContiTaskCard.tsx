import { Task, DreamContiDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Moon, Image, Sparkles, Hash } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'DREAM_CONTI' };
  onClick: () => void;
}

export default function DreamContiTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation();
  const details = task.details as DreamContiDetails | undefined;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">Dream Continuation</h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Dream Prompt */}
      {details?.request?.dreamPrompt && (
        <div className="mb-2 text-sm text-slate-300">
          <div className="line-clamp-2">
            "{details.request.dreamPrompt}"
          </div>
        </div>
      )}

      {/* Continuation Style */}
      {details?.request?.continuationStyle && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="h-4 w-4" />
          <span>Style: {details.request.continuationStyle}</span>
        </div>
      )}

      {/* Image Count */}
      {details?.request?.imageCount && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Hash className="h-4 w-4" />
          <span>{details.request.imageCount} images</span>
        </div>
      )}

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Image className="h-4 w-4" />
            <span>Dream continuation created</span>
          </div>
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
}