import { FanmeetingStudioDetails } from '@/types/task';
import {
  Image,
  Users,
  Clock,
  FileText,
  Download,
  Zap,
  MessageSquare,
} from 'lucide-react';

interface Props {
  details?: FanmeetingStudioDetails;
}

export default function FanmeetingStudioDetailsView({ details }: Props) {
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
          <Users className="h-5 w-5" />
          Fanmeeting Studio Configuration
        </h4>

        <div className="rounded-lg bg-slate-800/50 p-4 space-y-4">
          {/* Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                상황 프롬프트
              </label>
              <p className="text-slate-200">
                {details.request.situationPrompt || 'Not specified'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                배경 프롬프트
              </label>
              <p className="text-slate-200">
                {details.request.backgroundPrompt || 'Not specified'}
              </p>
            </div>
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

      {/* Source Images */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Image className="h-5 w-5" />
          원본 이미지
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fan Image */}
            <div>
              <h5 className="text-sm font-medium text-slate-400 mb-2">
                팬 이미지
              </h5>
              <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center">
                {details.request.fanImageUrl ? (
                  <img
                    src={details.request.fanImageUrl}
                    alt="팬 이미지"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-slate-400 text-sm">팬 이미지</span>
                )}
              </div>
              {details.request.fanImageKey && (
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {details.request.fanImageKey}
                </p>
              )}
            </div>

            {/* Idol Image */}
            <div>
              <h5 className="text-sm font-medium text-slate-400 mb-2">
                아이돌 이미지
              </h5>
              <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center">
                {details.request.idolImageUrl ? (
                  <img
                    src={details.request.idolImageUrl}
                    alt="아이돌 이미지"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-slate-400 text-sm">아이돌 이미지</span>
                )}
              </div>
              {details.request.idolImageKey && (
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {details.request.idolImageKey}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            팬미팅 스튜디오 결과
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-4">
              {/* Result Image */}
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-2">
                  생성된 팬미팅 장면
                </h5>
                <div className="w-full h-64 bg-slate-700 rounded flex items-center justify-center border-2 border-butter-yellow/30">
                  {details.result.imageUrl ? (
                    <img
                      src={details.result.imageUrl}
                      alt="생성된 팬미팅 장면"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-slate-400">생성된 팬미팅 장면</span>
                  )}
                </div>
                {details.result.imageKey && (
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    Key: {details.result.imageKey}
                  </p>
                )}
              </div>

              {/* Applied Prompts */}
              <div className="pt-4 border-t border-slate-700">
                <h5 className="text-sm font-medium text-slate-400 mb-3">
                  사용된 프롬프트
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">상황 프롬프트</div>
                    <div className="text-slate-200 font-medium">
                      {details.result.situationPrompt || '없음'}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400">배경 프롬프트</div>
                    <div className="text-slate-200 font-medium">
                      {details.result.backgroundPrompt || '없음'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-slate-400">파일명</div>
                    <div className="text-slate-200 font-mono text-xs">
                      {details.result.filename || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Prompt Used */}
              {details.result.promptUsed && (
                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    사용된 최종 프롬프트
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
              <p className="text-slate-200">Fanmeeting Studio</p>
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
