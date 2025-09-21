import { FanmeetingStudioDetails } from '@/types/task';
import { Users, Camera, MapPin, Heart } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: FanmeetingStudioDetails;
  onClose?: () => void;
  actionButtons?: React.ReactNode;
}

export default function FanmeetingStudioDetailsView({
  details,
  onClose,
  actionButtons,
}: Props) {
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">상세 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  const content = (
    <div className="bg-studio-sidebar border border-studio-border rounded-xl p-6 text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Users className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">팬미팅 스튜디오</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label="모드"
            value="팬미팅 장면 생성"
            variant="accent"
          />
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="space-y-6">
        {/* Source Images Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fan Image */}
          {details.request.fanImageUrl && (
            <ImageDisplayCard
              title="팬 이미지"
              subtitle="팬미팅에 참여할 팬"
              imageUrl={details.request.fanImageUrl}
              alt="업로드한 팬 이미지"
              imageClassName="h-48 object-cover"
            />
          )}

          {/* Idol Image */}
          {details.request.idolImageUrl && (
            <ImageDisplayCard
              title="아이돌 이미지"
              subtitle="팬미팅에 참여할 아이돌"
              imageUrl={details.request.idolImageUrl}
              alt="업로드한 아이돌 이미지"
              imageClassName="h-48 object-cover"
            />
          )}

          {/* Result Preview or Placeholder */}
          {details.result?.imageUrl ? (
            <ImageDisplayCard
              title="생성된 장면"
              subtitle="AI가 만든 팬미팅 장면"
              imageUrl={details.result.imageUrl}
              alt="생성된 팬미팅 장면"
              imageClassName="h-48 object-contain"
            />
          ) : (
            <div className="bg-studio-sidebar border border-studio-border rounded-xl p-4">
              <h4 className="text-sm font-medium text-studio-text-primary mb-3">
                결과 대기 중
              </h4>
              <div className="bg-studio-border rounded-lg p-3 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-8 w-8 text-studio-text-secondary mx-auto mb-2" />
                  <span className="text-sm text-studio-text-secondary">
                    팬미팅 장면 생성 예정
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Result Image (if exists) */}
        {details.result?.imageUrl && (
          <InfoCard title="생성된 팬미팅 장면 (전체)">
            <div className="bg-studio-border rounded-lg p-3">
              <img
                src={details.result.imageUrl}
                alt="생성된 팬미팅 장면"
                className="w-full h-auto max-h-[400px] object-contain rounded-md"
              />
            </div>
          </InfoCard>
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
