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
    return (
      prevProps.task.taskId === nextProps.task.taskId &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.details === nextProps.task.details
    );
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
