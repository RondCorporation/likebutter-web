import { Task, DigitalGoodsDetails } from '@/types/task';
import StatusBadge from '../StatusBadge';
import { useTranslation } from 'react-i18next';
import { Package, Image, Palette, Type } from 'lucide-react';

interface Props {
  task: Task & { actionType: 'DIGITAL_GOODS' };
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

      {/* Title */}
      {details?.request?.title && (
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Type className="h-4 w-4" />
          <span>Title: {details.request.title}</span>
        </div>
      )}

      {/* Product and Brand Info */}
      {(details?.request?.productName || details?.request?.brandName) && (
        <div className="mb-2 space-y-1">
          {details.request.productName && (
            <div className="text-sm text-slate-400">
              Product: {details.request.productName}
            </div>
          )}
          {details.request.brandName && (
            <div className="text-sm text-slate-400">
              Brand: {details.request.brandName}
            </div>
          )}
        </div>
      )}

      {/* Custom Prompt */}
      {details?.request?.customPrompt && (
        <div className="mb-2 text-sm text-slate-400">
          <div className="truncate">
            Prompt: "{details.request.customPrompt}"
          </div>
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