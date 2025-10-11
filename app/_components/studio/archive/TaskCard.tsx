import { Task } from '@/types/task';
import { memo } from 'react';
import ButterCoverTaskCard from './butter-cover/ButterCoverTaskCard';
import DigitalGoodsTaskCard from './digital-goods/DigitalGoodsTaskCard';
import FanmeetingStudioTaskCard from './fanmeeting-studio/FanmeetingStudioTaskCard';
import StylistTaskCard from './stylist/StylistTaskCard';
import VirtualCastingTaskCard from './virtual-casting/VirtualCastingTaskCard';

interface Props {
  task: Task;
  onClick: () => void;
}

const TaskCard = memo(
  ({ task, onClick }: Props) => {
    switch (task.actionType) {
      case 'BUTTER_COVER':
        return <ButterCoverTaskCard task={task} onClick={onClick} />;
      case 'DIGITAL_GOODS':
      case 'DIGITAL_GOODS_EDIT':
        return <DigitalGoodsTaskCard task={task} onClick={onClick} />;
      case 'FANMEETING_STUDIO':
      case 'FANMEETING_STUDIO_EDIT':
        return <FanmeetingStudioTaskCard task={task} onClick={onClick} />;
      case 'STYLIST':
      case 'STYLIST_EDIT':
        return <StylistTaskCard task={task} onClick={onClick} />;
      case 'VIRTUAL_CASTING':
      case 'VIRTUAL_CASTING_EDIT':
        return <VirtualCastingTaskCard task={task} onClick={onClick} />;
      default:
        return (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p>Unknown Task Type</p>
          </div>
        );
    }
  },
  (prevProps, nextProps) => {
    // Compare task data based on actionType-specific fields
    if (prevProps.task.taskId !== nextProps.task.taskId) return false;
    if (prevProps.task.status !== nextProps.task.status) return false;
    if (prevProps.task.actionType !== nextProps.task.actionType) return false;

    // Compare action-type-specific result data
    switch (prevProps.task.actionType) {
      case 'DIGITAL_GOODS':
      case 'DIGITAL_GOODS_EDIT':
        return (
          ('digitalGoods' in prevProps.task
            ? prevProps.task.digitalGoods
            : null) ===
          ('digitalGoods' in nextProps.task
            ? nextProps.task.digitalGoods
            : null)
        );
      case 'VIRTUAL_CASTING':
      case 'VIRTUAL_CASTING_EDIT':
        return (
          ('virtualCasting' in prevProps.task
            ? prevProps.task.virtualCasting
            : null) ===
          ('virtualCasting' in nextProps.task
            ? nextProps.task.virtualCasting
            : null)
        );
      case 'STYLIST':
      case 'STYLIST_EDIT':
        return (
          ('stylist' in prevProps.task ? prevProps.task.stylist : null) ===
          ('stylist' in nextProps.task ? nextProps.task.stylist : null)
        );
      case 'FANMEETING_STUDIO':
      case 'FANMEETING_STUDIO_EDIT':
        return (
          ('fanmeetingStudio' in prevProps.task
            ? prevProps.task.fanmeetingStudio
            : null) ===
          ('fanmeetingStudio' in nextProps.task
            ? nextProps.task.fanmeetingStudio
            : null)
        );
      case 'BUTTER_COVER':
        return (
          ('butterCover' in prevProps.task
            ? prevProps.task.butterCover
            : null) ===
          ('butterCover' in nextProps.task ? nextProps.task.butterCover : null)
        );
      default:
        return true;
    }
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
