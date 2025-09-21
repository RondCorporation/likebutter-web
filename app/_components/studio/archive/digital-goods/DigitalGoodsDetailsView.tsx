import { DigitalGoodsDetails } from '@/types/task';
import { Palette, Sparkles } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: DigitalGoodsDetails;
  onClose?: () => void;
  actionButtons?: React.ReactNode;
}

export default function DigitalGoodsDetailsView({ details, onClose, actionButtons }: Props) {
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">상세 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  const getStyleName = (style: string) => {
    const styleNames: { [key: string]: string } = {
      GHIBLI: '지브리 스타일',
      PIXEL_ART: '픽셀 아트',
      ANIMATION: '애니메이션',
      CARTOON: '카툰',
      SKETCH: '스케치',
      GRADUATION_PHOTO: '졸업사진',
      LEGO: '레고',
      STICKER: '스티커',
      FIGURE: '피규어',
    };
    return styleNames[style] || style;
  };

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Palette className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">디지털 굿즈 생성</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.request.style && (
            <ParameterBadge
              label="스타일"
              value={getStyleName(details.request.style)}
              variant="accent"
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Image */}
        {details.request.imageUrl && (
          <ImageDisplayCard
            title="원본 이미지"
            subtitle="업로드한 원본 이미지"
            imageUrl={details.request.imageUrl}
            alt="업로드한 원본 이미지"
          />
        )}

        {/* After Image */}
        {details.result?.imageUrl && (
          <ImageDisplayCard
            title="생성된 결과"
            subtitle={`${getStyleName(details.request.style)} 스타일로 변환`}
            imageUrl={details.result.imageUrl}
            alt="생성된 디지털 굿즈"
          />
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">생성 실패</h4>
            <p className="text-red-300 text-sm">{details.error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal onClose={onClose} actionButtons={actionButtons}>{content}</DetailsModal>
  ) : (
    content
  );
}
