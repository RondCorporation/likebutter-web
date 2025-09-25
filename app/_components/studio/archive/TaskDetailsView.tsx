import { Task } from '@/types/task';
import ButterCoverDetailsView from './butter-cover/ButterCoverDetailsView';
import DigitalGoodsDetailsView from './digital-goods/DigitalGoodsDetailsView';
import FanmeetingStudioDetailsView from './fanmeeting-studio/FanmeetingStudioDetailsView';
import StylistDetailsView from './stylist/StylistDetailsView';
import VirtualCastingDetailsView from './virtual-casting/VirtualCastingDetailsView';

export default function TaskDetailsView({
  task,
  onClose,
}: {
  task: Task;
  onClose?: () => void;
}) {
  switch (task.actionType) {
    case 'BUTTER_COVER':
      return (
        <ButterCoverDetailsView details={task.details} onClose={onClose} />
      );
    case 'DIGITAL_GOODS':
      return (
        <DigitalGoodsDetailsView details={task.details} onClose={onClose} />
      );
    case 'FANMEETING_STUDIO':
      return (
        <FanmeetingStudioDetailsView details={task.details} onClose={onClose} />
      );
    case 'STYLIST':
      return <StylistDetailsView details={task.details} onClose={onClose} />;
    case 'VIRTUAL_CASTING':
      return (
        <VirtualCastingDetailsView details={task.details} onClose={onClose} />
      );
    case 'DIGITAL_GOODS_EDIT':
      return (
        <DigitalGoodsDetailsView details={task.details} onClose={onClose} />
      );
    case 'FANMEETING_STUDIO_EDIT':
      return (
        <FanmeetingStudioDetailsView details={task.details} onClose={onClose} />
      );
    case 'STYLIST_EDIT':
      return <StylistDetailsView details={task.details} onClose={onClose} />;
    case 'VIRTUAL_CASTING_EDIT':
      return (
        <VirtualCastingDetailsView details={task.details} onClose={onClose} />
      );
    default:
      const exhaustiveCheck: never = task;
      return <p>Details for this task type are not available.</p>;
  }
}
