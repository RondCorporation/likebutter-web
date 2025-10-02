import { ButterCoverDetails } from '@/types/task';
import { Music, Download, Headphones, Settings } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import DetailsModal from '../ui/DetailsModal';
import { downloadFile } from '@/app/_utils/download';
import { useState } from 'react';

interface Props {
  details?: ButterCoverDetails;
  onClose?: () => void;
}

export default function ButterCoverDetailsView({ details, onClose }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">상세 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  const handleDownload = async (url: string, filename: string) => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadFile(url, filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const content = (
    <div className="text-studio-text-primary space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Headphones className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">AI 커버 음원</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label="모델"
            value={details.request.voiceModel}
            variant="accent"
          />
          {details.request.pitchAdjust !== undefined && (
            <ParameterBadge
              label="피치"
              value={`${details.request.pitchAdjust} 세미톤`}
            />
          )}
          {details.request.outputFormat && (
            <ParameterBadge
              label="포맷"
              value={details.request.outputFormat.toUpperCase()}
            />
          )}
        </div>
      </div>

      {/* AI 설정 정보 */}
      <InfoCard title="AI 설정 정보">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-studio-border rounded-lg">
            <Settings className="h-6 w-6 text-studio-text-secondary" />
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-studio-text-primary mb-1">
              최적화된 AI 설정
            </h5>
            <p className="text-sm text-studio-text-secondary">
              최고 품질을 위해 전문가가 튜닝한 파라미터입니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">Index Rate:</span>
            <span className="text-studio-text-primary ml-1 font-medium">
              0.75
            </span>
          </div>
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">Filter Radius:</span>
            <span className="text-studio-text-primary ml-1 font-medium">3</span>
          </div>
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">RMS Mix Rate:</span>
            <span className="text-studio-text-primary ml-1 font-medium">
              0.25
            </span>
          </div>
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">Protect:</span>
            <span className="text-studio-text-primary ml-1 font-medium">
              0.33
            </span>
          </div>
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">F0 Method:</span>
            <span className="text-studio-text-primary ml-1 font-medium">
              rmvpe
            </span>
          </div>
          <div className="bg-studio-border rounded-lg p-2">
            <span className="text-studio-text-secondary">Reverb:</span>
            <span className="text-studio-text-primary ml-1 font-medium">
              최적화됨
            </span>
          </div>
        </div>
      </InfoCard>

      {/* 생성된 파일 */}
      {details.result && (
        <InfoCard title="생성된 파일">
          <div className="space-y-3">
            {details.result.audioUrl && (
              <div className="flex items-center gap-3 rounded-lg bg-studio-border p-3">
                <div className="p-2 bg-studio-button-primary rounded-lg">
                  <Music className="h-4 w-4 text-studio-header" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-studio-text-primary">
                    AI 보이스 커버
                  </div>
                  <div className="text-sm text-studio-text-secondary">
                    메인 처리된 오디오 파일
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownload(
                      details.result!.audioUrl,
                      `butter-cover-${Date.now()}.mp3`
                    )
                  }
                  disabled={isDownloading}
                  className="p-2 bg-studio-button-primary hover:bg-studio-button-primary/80 disabled:opacity-50 rounded-lg transition-colors"
                  title="다운로드"
                >
                  <Download className="h-4 w-4 text-studio-header" />
                </button>
              </div>
            )}

            {details.intermediateResult?.vocalsUrl && (
              <div className="flex items-center gap-3 rounded-lg bg-studio-border p-3">
                <div className="p-2 bg-studio-border rounded-lg">
                  <Headphones className="h-4 w-4 text-studio-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-studio-text-primary">
                    보컬 트랙
                  </div>
                  <div className="text-sm text-studio-text-secondary">
                    분리된 보컬 트랙
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownload(
                      details.intermediateResult!.vocalsUrl!,
                      `butter-cover-vocals-${Date.now()}.mp3`
                    )
                  }
                  disabled={isDownloading}
                  className="p-2 bg-studio-button-primary hover:bg-studio-button-primary/80 disabled:opacity-50 rounded-lg transition-colors"
                  title="다운로드"
                >
                  <Download className="h-4 w-4 text-studio-header" />
                </button>
              </div>
            )}

            {details.intermediateResult?.instrumentalsUrl && (
              <div className="flex items-center gap-3 rounded-lg bg-studio-border p-3">
                <div className="p-2 bg-studio-border rounded-lg">
                  <Music className="h-4 w-4 text-studio-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-studio-text-primary">
                    인스트루멘털 트랙
                  </div>
                  <div className="text-sm text-studio-text-secondary">
                    분리된 인스트루멘털 트랙
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownload(
                      details.intermediateResult!.instrumentalsUrl!,
                      `butter-cover-instrumentals-${Date.now()}.mp3`
                    )
                  }
                  disabled={isDownloading}
                  className="p-2 bg-studio-button-primary hover:bg-studio-button-primary/80 disabled:opacity-50 rounded-lg transition-colors"
                  title="다운로드"
                >
                  <Download className="h-4 w-4 text-studio-header" />
                </button>
              </div>
            )}
          </div>
        </InfoCard>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal onClose={onClose}>{content}</DetailsModal>
  ) : (
    content
  );
}
