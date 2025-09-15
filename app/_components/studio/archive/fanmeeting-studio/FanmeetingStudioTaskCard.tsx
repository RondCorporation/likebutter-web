import { Task, FanmeetingStudioDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Heart, Users, MessageSquare, FileText, Image } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'FANMEETING_STUDIO' };
  onClick: () => void;
}

export default function FanmeetingStudioTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation();
  const details = task.details as FanmeetingStudioDetails | undefined;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">
            Fanmeeting Studio
          </h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Situation Prompt */}
      {details?.request?.situationPrompt && (
        <div className="mb-2 flex items-start gap-2 text-sm text-slate-300">
          <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{details.request.situationPrompt}</span>
        </div>
      )}

      {/* Background Prompt */}
      {details?.request?.backgroundPrompt && (
        <div className="mb-2 flex items-start gap-2 text-sm text-slate-400">
          <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{details.request.backgroundPrompt}</span>
        </div>
      )}

      {/* Custom Prompt */}
      {details?.request?.customPrompt && (
        <div className="mb-2 flex items-start gap-2 text-sm text-slate-400">
          <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{details.request.customPrompt}</span>
        </div>
      )}

      {/* Images Info */}
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Users className="h-4 w-4" />
        <span>팬 & 아이돌 이미지</span>
      </div>

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Image className="h-4 w-4" />
            <span>팬미팅 장면 생성 완료</span>
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
          Feature coming soon
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}