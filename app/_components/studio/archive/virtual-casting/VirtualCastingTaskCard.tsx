import { Task } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Wand2, Image, Star } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'VIRTUAL_CASTING' | 'VIRTUAL_CASTING_EDIT' };
  onClick: () => void;
}

export default function VirtualCastingTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation('studio');
  const result = task.virtualCasting;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">
            {t('virtualCasting.title')}
          </h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Result Info */}
      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Star className="h-4 w-4" />
            <span>{t('virtualCasting.taskCard.castingComplete')}</span>
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
          {t('common.comingSoon')}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
