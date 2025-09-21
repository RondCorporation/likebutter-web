import { VirtualCastingDetails } from '@/types/task';
import { Wand2, Star, Film, Sparkles } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: VirtualCastingDetails;
  onClose?: () => void;
}

export default function VirtualCastingDetailsView({ details, onClose }: Props) {
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">상세 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  const getCharacterName = (style: string) => {
    const characterNames: { [key: string]: string } = {
      ELSA: '겨울왕국 엘사',
      ANNA: '겨울왕국 안나',
      BELLE: '미녀와 야수 벨',
      ARIEL: '인어공주 에리얼',
      MOANA: '모아나',
      RAPUNZEL: '라푼젤',
      MULAN: '뮬란',
      TIANA: '공주와 개구리 티아나',
      MERIDA: '메리다',
      POCAHONTAS: '포카혼타스',
      JASMINE: '알라딘 자스민',
      CINDERELLA: '신데렐라',
      AURORA: '잠자는 숲속의 미녀 오로라',
      SNOW_WHITE: '백설공주',
    };
    return characterNames[style] || style;
  };

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Wand2 className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">가상 캐스팅</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.request.style && (
            <ParameterBadge
              label="캐릭터"
              value={getCharacterName(details.request.style)}
              variant="accent"
            />
          )}
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Image */}
        {details.request.idolImageUrl && (
          <ImageDisplayCard
            title="원본 이미지"
            subtitle="캐릭터로 변환할 기본 이미지"
            imageUrl={details.request.idolImageUrl}
            alt="업로드한 원본 이미지"
          />
        )}

        {/* After Image */}
        {details.result?.imageUrl && (
          <ImageDisplayCard
            title="변환된 결과"
            subtitle={`${getCharacterName(details.request.style)} 캐릭터로 변환`}
            imageUrl={details.result.imageUrl}
            alt="캐릭터로 변환된 이미지"
          />
        )}
      </div>

      {/* Character Info Card */}
      {details.request.style && (
        <div className="mt-6">
          <InfoCard title="캐릭터 정보">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-studio-border rounded-lg">
                <Film className="h-6 w-6 text-studio-text-secondary" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-studio-text-primary mb-1">
                  {getCharacterName(details.request.style)}
                </h5>
                <p className="text-sm text-studio-text-secondary">
                  AI가 이 캐릭터의 특징을 분석하여 자연스럽게 변환했습니다.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-butter-yellow" />
                <span className="text-sm font-medium text-studio-text-primary">
                  AI 변환
                </span>
              </div>
            </div>
          </InfoCard>
        </div>
      )}

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">변환 실패</h4>
            <p className="text-red-300 text-sm">{details.error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal onClose={onClose}>{content}</DetailsModal>
  ) : (
    content
  );
}
