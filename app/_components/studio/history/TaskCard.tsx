import { Task } from '@/types/task';
import ButterCoverTaskCard from './butter-cover/ButterCoverTaskCard';
import DigitalGoodsTaskCard from './digital-goods/DigitalGoodsTaskCard';
import DreamContiTaskCard from './dream-conti/DreamContiTaskCard';
import FanmeetingStudioTaskCard from './fanmeeting-studio/FanmeetingStudioTaskCard';
import PhotoEditorTaskCard from './photo-editor/PhotoEditorTaskCard';

interface Props {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: Props) {
  switch (task.actionType) {
    case 'BUTTER_COVER':
      return <ButterCoverTaskCard task={task} onClick={onClick} />;
    case 'DIGITAL_GOODS':
      return <DigitalGoodsTaskCard task={task} onClick={onClick} />;
    case 'DREAM_CONTI':
      return <DreamContiTaskCard task={task} onClick={onClick} />;
    case 'FANMEETING_STUDIO':
      return <FanmeetingStudioTaskCard task={task} onClick={onClick} />;
    case 'PHOTO_EDITOR':
      return <PhotoEditorTaskCard task={task} onClick={onClick} />;
    default:
      const exhaustiveCheck: never = task;
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p>Unknown Task Type</p>
        </div>
      );
  }
}
