import { Task, ButterCoverDetails, PipelineStatus } from '@/types/task';
import { memo } from 'react';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Music, Download, Clock, Volume2, Settings } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'BUTTER_COVER' };
  onClick: () => void;
}

function getPipelineStatusText(pipelineStatus?: PipelineStatus): string {
  switch (pipelineStatus) {
    case 'AUDIO_SEPARATION_IN_PROGRESS':
      return 'Separating Audio...';
    case 'AUDIO_SEPARATION_COMPLETED':
      return 'Audio Separated';
    case 'AI_COVER_GENERATION_IN_PROGRESS':
      return 'Generating AI Cover...';
    case 'COMPLETED':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    default:
      return 'Pending';
  }
}

function getPipelineStatusIcon(pipelineStatus?: PipelineStatus) {
  switch (pipelineStatus) {
    case 'AUDIO_SEPARATION_IN_PROGRESS':
    case 'AI_COVER_GENERATION_IN_PROGRESS':
      return <Clock className="h-4 w-4 animate-spin text-blue-400" />;
    case 'COMPLETED':
      return <Download className="h-4 w-4 text-green-400" />;
    case 'FAILED':
      return <Volume2 className="h-4 w-4 text-red-400" />;
    default:
      return <Music className="h-4 w-4 text-slate-400" />;
  }
}

const ButterCoverTaskCard = memo(({ task, onClick }: Props) => {
  const { t } = useTranslation();
  const details = task.details as ButterCoverDetails | undefined;

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
        <StatusBadge
          status={task.status}
          pipelineStatus={(task as any).pipelineStatus}
        />
      </div>

      {/* Pipeline Status */}
      {details && (
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          {getPipelineStatusIcon((task as any).pipelineStatus)}
          <span>{getPipelineStatusText((task as any).pipelineStatus)}</span>
        </div>
      )}

      {/* Voice Model */}
      {details?.request?.voiceModel && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Volume2 className="h-4 w-4" />
          <span>Voice: {details.request.voiceModel}</span>
        </div>
      )}

      {/* Advanced Settings Indicator */}
      {details?.request && Object.keys(details.request).length > 2 && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Settings className="h-4 w-4" />
          <span>Advanced settings applied</span>
        </div>
      )}

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>AI voice cover completed successfully</span>
          </div>
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
