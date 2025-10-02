import { Task, DigitalGoodsDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Package, Image, Palette, Type } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'DIGITAL_GOODS' | 'DIGITAL_GOODS_EDIT' };
  onClick: () => void;
}

export default function DigitalGoodsTaskCard({ task, onClick }: Props) {
  const { t } = useTranslation();
  const details = task.details as DigitalGoodsDetails | undefined;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-semibold text-white">Digital Goods</h4>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Style */}
      {details?.request?.style && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Palette className="h-4 w-4" />
          <span>Style: {details.request.style}</span>
        </div>
      )}

      {/* Source Image Key */}
      {details?.request?.imageKey && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Image className="h-4 w-4" />
          <span className="text-xs font-mono truncate">
            Image: {details.request.imageKey}
          </span>
        </div>
      )}

      {/* Result Info */}
      {details?.result && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Image className="h-4 w-4" />
            <span>Digital goods created successfully</span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
