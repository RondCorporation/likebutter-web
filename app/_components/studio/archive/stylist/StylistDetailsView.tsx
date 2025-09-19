import { StylistDetails } from '@/types/task';
import {
  Image,
  Sparkles,
  Clock,
  FileText,
  Download,
  Zap,
  Palette,
  Shirt,
  Camera,
} from 'lucide-react';

interface Props {
  details?: StylistDetails;
}

export default function StylistDetailsView({ details }: Props) {
  if (!details) {
    return <p className="text-slate-400">No details available</p>;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatExecutionTime = (seconds: number) => {
    return `${seconds.toFixed(2)}초`;
  };

  const renderStyleImage = (
    imageUrl: string | undefined,
    label: string,
    icon: React.ReactNode
  ) => {
    if (!imageUrl) return null;

    return (
      <div>
        <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
          {icon}
          {label}
        </label>
        <div className="w-full h-32 bg-slate-700 rounded flex items-center justify-center">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover rounded"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Palette className="h-5 w-5" />
          Stylist Configuration
        </h4>

        <div className="rounded-lg bg-slate-800/50 p-4 space-y-4">
          {/* Basic Prompt */}
          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" />
              기본 프롬프트
            </label>
            <p className="text-slate-200">
              {details.request.prompt || 'Not specified'}
            </p>
          </div>

          {/* Custom Prompt */}
          {details.request.customPrompt && (
            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                커스텀 프롬프트
              </label>
              <p className="text-slate-200">{details.request.customPrompt}</p>
            </div>
          )}
        </div>
      </div>

      {/* Source Image */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Image className="h-5 w-5" />
          원본 이미지
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="w-full h-64 bg-slate-700 rounded flex items-center justify-center">
            {details.request.idolImageUrl ? (
              <img
                src={details.request.idolImageUrl}
                alt="원본 이미지"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-slate-400">원본 이미지 미리보기</span>
            )}
          </div>
          {details.request.idolImageKey && (
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Key: {details.request.idolImageKey}
            </p>
          )}
        </div>
      </div>

      {/* Style References */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Sparkles className="h-5 w-5" />
          스타일 참조 이미지
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderStyleImage(
              details.request.hairStyleImageUrl,
              '헤어 스타일',
              <Sparkles className="h-4 w-4" />
            )}
            {renderStyleImage(
              details.request.outfitImageUrl,
              '의상',
              <Shirt className="h-4 w-4" />
            )}
            {renderStyleImage(
              details.request.backgroundImageUrl,
              '배경',
              <Camera className="h-4 w-4" />
            )}
            {renderStyleImage(
              details.request.accessoryImageUrl,
              '액세서리',
              <Sparkles className="h-4 w-4" />
            )}
            {renderStyleImage(
              details.request.moodImageUrl,
              '무드',
              <Palette className="h-4 w-4" />
            )}
          </div>
          {!details.request.hairStyleImageUrl &&
            !details.request.outfitImageUrl &&
            !details.request.backgroundImageUrl &&
            !details.request.accessoryImageUrl &&
            !details.request.moodImageUrl && (
              <p className="text-slate-400 text-center">
                스타일 참조 이미지가 없습니다
              </p>
            )}
        </div>
      </div>

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            스타일링 결과
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-4">
              {/* Before/After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">
                    원본
                  </h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center">
                    {details.request.idolImageUrl ? (
                      <img
                        src={details.request.idolImageUrl}
                        alt="원본 이미지"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">
                        원본 이미지
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">
                    스타일링 결과
                  </h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center border-2 border-butter-yellow/30">
                    {details.result.imageUrl ? (
                      <img
                        src={details.result.imageUrl}
                        alt="스타일링된 이미지"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">
                        스타일링 결과
                      </span>
                    )}
                  </div>
                  {details.result.imageKey && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {details.result.imageKey}
                    </p>
                  )}
                </div>
              </div>

              {/* Applied Styling Summary */}
              <div className="pt-4 border-t border-slate-700">
                <h5 className="text-sm font-medium text-slate-400 mb-3">
                  적용된 스타일링
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {details.result.hairStyleUsed && (
                    <div>
                      <div className="text-slate-400">헤어 스타일</div>
                      <div className="text-slate-200 font-medium">
                        {details.result.hairStyleUsed}
                      </div>
                    </div>
                  )}
                  {details.result.outfitUsed && (
                    <div>
                      <div className="text-slate-400">의상</div>
                      <div className="text-slate-200 font-medium">
                        {details.result.outfitUsed}
                      </div>
                    </div>
                  )}
                  {details.result.backgroundUsed && (
                    <div>
                      <div className="text-slate-400">배경</div>
                      <div className="text-slate-200 font-medium">
                        {details.result.backgroundUsed}
                      </div>
                    </div>
                  )}
                  {details.result.accessoryUsed && (
                    <div>
                      <div className="text-slate-400">액세서리</div>
                      <div className="text-slate-200 font-medium">
                        {details.result.accessoryUsed}
                      </div>
                    </div>
                  )}
                  {details.result.moodUsed && (
                    <div>
                      <div className="text-slate-400">무드</div>
                      <div className="text-slate-200 font-medium">
                        {details.result.moodUsed}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-slate-400">파일명</div>
                    <div className="text-slate-200 font-mono text-xs">
                      {details.result.filename}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Information */}
              {details.result.promptUsed && (
                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    사용된 프롬프트
                  </label>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {details.result.promptUsed}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing Information */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Zap className="h-5 w-5" />
          처리 정보
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                처리 시간
              </label>
              <p className="text-slate-200">
                {details.result
                  ? formatExecutionTime(details.result.executionTime)
                  : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-slate-400">파일 크기</label>
              <p className="text-slate-200">
                {details.result
                  ? formatFileSize(details.result.fileSize)
                  : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-slate-400">변환 타입</label>
              <p className="text-slate-200">AI Stylist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Information */}
      {details.error && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-red-400">
            <FileText className="h-5 w-5" />
            오류 정보
          </h4>
          <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-4">
            <p className="text-red-300">{details.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
