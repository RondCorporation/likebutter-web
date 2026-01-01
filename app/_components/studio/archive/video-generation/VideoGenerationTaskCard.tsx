import { Task } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Video, Film } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'VIDEO_GENERATION' };
  onClick: () => void;
}

export default function VideoGenerationTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation('studio');
  const result = task.videoGeneration;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">
            {t('tools.videoGeneration.title')}
          </h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Film className="h-4 w-4" />
            <span>{t('videoGeneration.archive.createdSuccess')}</span>
          </div>
          {result.duration && (
            <div className="mt-2 text-xs text-slate-400">
              {t('videoGeneration.archive.duration', { seconds: result.duration })}
            </div>
          )}
          {result.filename && (
            <div className="mt-1 text-xs text-slate-400 truncate">
              {result.filename}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
