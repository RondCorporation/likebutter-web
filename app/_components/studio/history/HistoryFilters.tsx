import { GenerationStatus, ActionType } from '@/types/task';
import { useTranslation } from 'react-i18next';

interface Props {
  onFilterChange: (filters: { status?: string; actionType?: string }) => void;
}

export default function HistoryFilters({ onFilterChange }: Props) {
  const { t } = useTranslation();

  const STATUS_OPTIONS: { label: string; value: GenerationStatus | '' }[] = [
    { label: t('historyFilterStatusAll'), value: '' },
    { label: t('historyFilterStatusCompleted'), value: 'COMPLETED' },
    { label: t('historyFilterStatusFailed'), value: 'FAILED' },
    { label: t('historyFilterStatusProcessing'), value: 'PROCESSING' },
    { label: t('historyFilterStatusPending'), value: 'PENDING' },
  ];

  const ACTION_TYPE_OPTIONS: { label: string; value: ActionType | '' }[] = [
    { label: t('historyFilterTypeAll'), value: '' },
    { label: t('historyFilterTypeButterGen'), value: 'BUTTER_GEN' },
    { label: t('historyFilterTypeButterTest'), value: 'BUTTER_TEST' },
    { label: t('historyFilterTypeButterCover'), value: 'BUTTER_COVER' },
  ];

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
