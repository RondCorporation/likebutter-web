import { Task } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Palette, Image } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'STYLIST' | 'STYLIST_EDIT' };
  onClick: () => void;
}

export default function StylistTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation('studio');
  const result = task.stylist;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">AI Stylist</h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Result Info */}
      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Palette className="h-4 w-4" />
            <span>{t('stylist.taskCard.aiStylingComplete')}</span>
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
}
