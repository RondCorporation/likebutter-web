import { StylistDetails } from '@/types/task';
import { Scissors, FileText, Image as ImageIcon, Palette } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: StylistDetails;
  onClose?: () => void;
  actionButtons?: React.ReactNode;
}

export default function StylistDetailsView({ details, onClose, actionButtons }: Props) {
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">상세 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  const getReferenceImages = () => {
    const references = [];

    if (details.request.hairStyleImageUrl) {
      references.push({
        url: details.request.hairStyleImageUrl,
        label: '헤어스타일 참고',
        key: 'hair',
      });
    }

    if (details.request.outfitImageUrl) {
      references.push({
        url: details.request.outfitImageUrl,
        label: '의상 참고',
        key: 'outfit',
      });
    }

    if (details.request.backgroundImageUrl) {
      references.push({
        url: details.request.backgroundImageUrl,
        label: '배경 참고',
        key: 'background',
      });
    }

    if (details.request.accessoryImageUrl) {
      references.push({
        url: details.request.accessoryImageUrl,
        label: '액세서리 참고',
        key: 'accessory',
      });
    }

    if (details.request.moodImageUrl) {
      references.push({
        url: details.request.moodImageUrl,
        label: '분위기 참고',
        key: 'mood',
      });
    }

    return references;
  };

  const referenceImages = getReferenceImages();

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Scissors className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">AI 스타일리스트</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label="참고 이미지"
            value={`${referenceImages.length}개`}
            variant="accent"
          />
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="space-y-6">
        {/* Original and Result Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          {details.request.idolImageUrl && (
            <ImageDisplayCard
              title="원본 이미지"
              subtitle="스타일링할 기본 이미지"
              imageUrl={details.request.idolImageUrl}
              alt="업로드한 원본 이미지"
            />
          )}

          {/* Result Image */}
          {details.result?.imageUrl && (
            <ImageDisplayCard
              title="스타일링된 결과"
              subtitle="AI가 생성한 최종 결과물"
              imageUrl={details.result.imageUrl}
              alt="AI가 스타일링한 이미지"
            />
          )}
        </div>

        {/* Reference Images Grid */}
        {referenceImages.length > 0 && (
          <InfoCard title="사용된 참고 이미지">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {referenceImages.map((ref) => (
                <div key={ref.key} className="bg-studio-border rounded-lg p-2">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-studio-text-secondary flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {ref.label}
                    </span>
                  </div>
                  <img
                    src={ref.url}
                    alt={ref.label}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </InfoCard>
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">스타일링 실패</h4>
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
