import { Task, StylistDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Palette, Sparkles, FileText, Image, Shirt } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'STYLIST' | 'STYLIST_EDIT' };
  onClick: () => void;
}

export default function StylistTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation('studio');
  const details = task.details as StylistDetails | undefined;

  const styleRefCount = [
    details?.request?.hairStyleImageKey,
    details?.request?.outfitImageKey,
    details?.request?.backgroundImageKey,
    details?.request?.accessoryImageKey,
    details?.request?.moodImageKey,
  ].filter(Boolean).length;

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

      {/* Basic Prompt */}
      {details?.request?.prompt && (
        <div className="mb-2 flex items-start gap-2 text-sm text-slate-300">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{details.request.prompt}</span>
        </div>
      )}

      {/* Custom Prompt */}
      {details?.request?.customPrompt && (
        <div className="mb-2 flex items-start gap-2 text-sm text-slate-400">
          <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{details.request.customPrompt}</span>
        </div>
      )}

      {/* Style References */}
      {styleRefCount > 0 && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Shirt className="h-4 w-4" />
          <span>
            {t('stylist.taskCard.styleReferences', { count: styleRefCount })}
          </span>
        </div>
      )}

      {/* Idol Image Info */}
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Image className="h-4 w-4" />
        <span>{t('stylist.taskCard.idolImageUploaded')}</span>
      </div>

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Palette className="h-4 w-4" />
            <span>{t('stylist.taskCard.aiStylingComplete')}</span>
          </div>
          {details.result.filename && (
            <div className="mt-1 text-xs text-slate-500 font-mono">
              {details.result.filename}
            </div>
          )}

          {/* Applied Styles Summary */}
          <div className="mt-2 flex flex-wrap gap-1">
            {details.result.hairStyleUsed && (
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                {t('stylist.taskCard.hair')}
              </span>
            )}
            {details.result.outfitUsed && (
              <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                {t('stylist.taskCard.outfit')}
              </span>
            )}
            {details.result.backgroundUsed && (
              <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-300">
                {t('stylist.taskCard.background')}
              </span>
            )}
            {details.result.accessoryUsed && (
              <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                {t('stylist.taskCard.accessory')}
              </span>
            )}
            {details.result.moodUsed && (
              <span className="rounded bg-pink-500/20 px-2 py-1 text-xs text-pink-300">
                {t('stylist.taskCard.mood')}
              </span>
            )}
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
