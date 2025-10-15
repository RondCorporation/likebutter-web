import { Task } from '@/types/task';
import ButterCoverDetailsView from './butter-cover/ButterCoverDetailsView';
import DigitalGoodsDetailsView from './digital-goods/DigitalGoodsDetailsView';
import FanmeetingStudioDetailsView from './fanmeeting-studio/FanmeetingStudioDetailsView';
import StylistDetailsView from './stylist/StylistDetailsView';
import VirtualCastingDetailsView from './virtual-casting/VirtualCastingDetailsView';

export default function TaskDetailsView({
  task,
  onClose,
  onEdit,
}: {
  task: Task;
  onClose?: () => void;
  onEdit?: () => void;
}) {
  switch (task.actionType) {
    case 'BUTTER_COVER':
      return <ButterCoverDetailsView task={task} onClose={onClose} />;
    case 'DIGITAL_GOODS':
    case 'DIGITAL_GOODS_EDIT':
      return (
        <DigitalGoodsDetailsView
          task={task as any}
          onClose={onClose}
          onEdit={onEdit}
        />
      );
    case 'FANMEETING_STUDIO':
    case 'FANMEETING_STUDIO_EDIT':
      return (
        <FanmeetingStudioDetailsView
          task={task as any}
          onClose={onClose}
          onEdit={onEdit}
        />
      );
    case 'STYLIST':
    case 'STYLIST_EDIT':
      return (
        <StylistDetailsView
          task={task as any}
          onClose={onClose}
          onEdit={onEdit}
        />
      );
    case 'VIRTUAL_CASTING':
    case 'VIRTUAL_CASTING_EDIT':
      return (
        <VirtualCastingDetailsView
          task={task as any}
          onClose={onClose}
          onEdit={onEdit}
        />
      );
    default:
      const exhaustiveCheck: never = task;
      return <p>Details for this task type are not available.</p>;
  }
}
