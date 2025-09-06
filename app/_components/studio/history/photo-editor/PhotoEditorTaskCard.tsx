import { Task, PhotoEditorDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { ImageIcon, Sliders, Filter, Image } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'PHOTO_EDITOR' };
  onClick: () => void;
}

export default function PhotoEditorTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation();
  const details = task.details as PhotoEditorDetails | undefined;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">Photo Editor</h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Edit Type */}
      {details?.request?.editType && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Sliders className="h-4 w-4" />
          <span>Edit: {details.request.editType.replace('_', ' ')}</span>
        </div>
      )}

      {/* Filter */}
      {details?.request?.applyFilter && details.request.applyFilter !== 'none' && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" />
          <span>Filter: {details.request.applyFilter.replace('_', ' ')}</span>
        </div>
      )}

      {/* Adjustments */}
      {details?.request && (
        <div className="mb-2 text-sm text-slate-400">
          <div className="space-y-1">
            {details.request.brightness !== 1.0 && (
              <div>Brightness: {details.request.brightness.toFixed(1)}</div>
            )}
            {details.request.contrast !== 1.0 && (
              <div>Contrast: {details.request.contrast.toFixed(1)}</div>
            )}
            {details.request.saturation !== 1.0 && (
              <div>Saturation: {details.request.saturation.toFixed(1)}</div>
            )}
          </div>
        </div>
      )}

      {/* Quality Enhancement */}
      {details?.request?.enhanceQuality && (
        <div className="mb-2 text-sm text-slate-400">
          Quality enhancement enabled
        </div>
      )}

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Image className="h-4 w-4" />
            <span>Photo edited successfully</span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}