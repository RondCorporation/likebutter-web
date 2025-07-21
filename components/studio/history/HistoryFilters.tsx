import { GenerationStatus, ActionType } from '@/types/task';

interface Props {
  onFilterChange: (filters: { status?: string; actionType?: string }) => void;
}

const STATUS_OPTIONS: { label: string; value: GenerationStatus | '' }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Pending', value: 'PENDING' },
];

const ACTION_TYPE_OPTIONS: { label: string; value: ActionType | '' }[] = [
  { label: 'All Types', value: '' },
  { label: 'ButterGen', value: 'BUTTER_GEN' },
  { label: 'ButterTest', value: 'BUTTER_TEST' },
];

export default function HistoryFilters({ onFilterChange }: Props) {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <select
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="w-full md:w-1/4 rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => onFilterChange({ actionType: e.target.value })}
        className="w-full md:w-1/4 rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
      >
        {ACTION_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
