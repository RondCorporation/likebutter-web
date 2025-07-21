import { GenerationStatus } from '@/types/task';

export default function StatusBadge({ status }: { status: GenerationStatus }) {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
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
