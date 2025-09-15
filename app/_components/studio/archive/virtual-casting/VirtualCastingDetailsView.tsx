import { VirtualCastingDetails } from '@/types/task';
import { Image, Sparkles, Clock, FileText, Download, Zap } from 'lucide-react';

interface Props {
  details?: VirtualCastingDetails;
}

export default function VirtualCastingDetailsView({ details }: Props) {
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

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Sparkles className="h-5 w-5" />
          Virtual Casting Configuration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" />
              키워드
            </label>
            <p className="text-slate-200">{details.request.keyword || 'Not specified'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              커스텀 프롬프트
            </label>
            <p className="text-slate-200">{details.request.customPrompt || '사용 안함'}</p>
          </div>
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

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            변환 결과
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-4">
              {/* Before/After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">원본</h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center">
                    {details.request.idolImageUrl ? (
                      <img
                        src={details.request.idolImageUrl}
                        alt="원본 이미지"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">원본 이미지</span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">변환 결과</h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center border-2 border-butter-yellow/30">
                    {details.result.imageUrl ? (
                      <img
                        src={details.result.imageUrl}
                        alt="변환된 이미지"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">변환 결과</span>
                    )}
                  </div>
                  {details.result.imageKey && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {details.result.imageKey}
                    </p>
                  )}
                </div>
              </div>

              {/* Applied Settings Summary */}
              <div className="pt-4 border-t border-slate-700">
                <h5 className="text-sm font-medium text-slate-400 mb-3">적용된 설정</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">사용된 키워드</div>
                    <div className="text-slate-200 font-medium">
                      {details.result.keywordUsed}
                    </div>
                  </div>
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
                {details.result ? formatExecutionTime(details.result.executionTime) : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-slate-400">파일 크기</label>
              <p className="text-slate-200">
                {details.result ? formatFileSize(details.result.fileSize) : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-slate-400">변환 타입</label>
              <p className="text-slate-200">Virtual Casting</p>
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