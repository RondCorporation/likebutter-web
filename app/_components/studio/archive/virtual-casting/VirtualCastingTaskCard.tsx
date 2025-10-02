import { Task, VirtualCastingDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Wand2, Image, Film, Star } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'VIRTUAL_CASTING' | 'VIRTUAL_CASTING_EDIT' };
  onClick: () => void;
}

export default function VirtualCastingTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation('studio');
  const details = task.details as VirtualCastingDetails | undefined;

  const getCharacterName = (style: string) => {
    try {
      return t(`virtualCasting.styles.${style}`);
    } catch {
      return style;
    }
  };

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

      {/* Character/Style */}
      {details?.request?.style && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Film className="h-4 w-4" />
          <span>{getCharacterName(details.request.style)}</span>
        </div>
      )}

      {/* Source Image Info */}
      {details?.request?.idolImageKey && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Image className="h-4 w-4" />
          <span>{t('virtualCasting.taskCard.idolImageUploaded')}</span>
        </div>
      )}

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Star className="h-4 w-4" />
            <span>{t('virtualCasting.taskCard.castingComplete')}</span>
          </div>
          {details.result.filename && (
            <div className="mt-1 text-xs text-slate-500 font-mono">
              {details.result.filename}
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
