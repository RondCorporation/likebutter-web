import { GenerationStatus, PipelineStatus } from '@/types/task';

export default function StatusBadge({ status, pipelineStatus }: { 
  status: GenerationStatus;
  pipelineStatus?: PipelineStatus;
}) {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  
  // Handle pipeline status for ButterCover tasks
  if (pipelineStatus) {
    switch (pipelineStatus) {
      case 'AUDIO_SEPARATION_IN_PROGRESS':
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-300 animate-pulse`}>
            Separating
          </span>
        );
      case 'AUDIO_SEPARATION_COMPLETED':
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300`}>
            Audio Ready
          </span>
        );
      case 'AI_COVER_GENERATION_IN_PROGRESS':
        return (
          <span className={`${baseClasses} bg-purple-500/20 text-purple-300 animate-pulse`}>
            Generating
          </span>
        );
      case 'COMPLETED':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300`}>
            Completed
          </span>
        );
      case 'FAILED':
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-400`}>
            Failed
          </span>
        );
    }
  }

  // Default status handling
  switch (status) {
    case 'COMPLETED':
      return (
        <span className={`${baseClasses} bg-green-500/20 text-green-300`}>
          Completed
        </span>
      );
    case 'FAILED':
      return (
        <span className={`${baseClasses} bg-red-500/20 text-red-400`}>
          Failed
        </span>
      );
    case 'PROCESSING':
      return (
        <span
          className={`${baseClasses} bg-blue-500/20 text-blue-300 animate-pulse`}
        >
          Processing
        </span>
      );
    case 'PENDING':
      return (
        <span className={`${baseClasses} bg-slate-500/20 text-slate-300`}>
          Pending
        </span>
      );
  }
}
