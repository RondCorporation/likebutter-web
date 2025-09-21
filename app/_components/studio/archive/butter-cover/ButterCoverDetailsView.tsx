import { ButterCoverDetails } from '@/types/task';
import { Music, Download } from 'lucide-react';

interface Props {
  details?: ButterCoverDetails;
}

export default function ButterCoverDetailsView({ details }: Props) {
  if (!details) {
    return <p className="text-slate-400">No details available</p>;
  }

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Music className="h-5 w-5" />
          Voice Cover Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
          <div>
            <label className="text-sm font-medium text-slate-400">
              Voice Model
            </label>
            <p className="text-slate-200">{details.request.voiceModel}</p>
          </div>

          {details.request.pitchAdjust !== undefined && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Pitch Adjust
              </label>
              <p className="text-slate-200">
                {details.request.pitchAdjust} semitones
              </p>
            </div>
          )}

          {details.request.outputFormat && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Output Format
              </label>
              <p className="text-slate-200 uppercase">
                {details.request.outputFormat}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 최적화된 설정 정보 */}
      <div>
        <h4 className="mb-3 font-semibold text-slate-200">최적화된 AI 설정</h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-slate-300 text-sm">
            이 AI 커버는 최고 품질을 위해 전문가가 튜닝한 최적화된 파라미터로 생성되었습니다.
          </p>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Index Rate:</span>
              <span className="text-slate-200 ml-1">0.75</span>
            </div>
            <div>
              <span className="text-slate-400">Filter Radius:</span>
              <span className="text-slate-200 ml-1">3</span>
            </div>
            <div>
              <span className="text-slate-400">RMS Mix Rate:</span>
              <span className="text-slate-200 ml-1">0.25</span>
            </div>
            <div>
              <span className="text-slate-400">Protect:</span>
              <span className="text-slate-200 ml-1">0.33</span>
            </div>
            <div>
              <span className="text-slate-400">F0 Method:</span>
              <span className="text-slate-200 ml-1">rmvpe</span>
            </div>
            <div>
              <span className="text-slate-400">Reverb:</span>
              <span className="text-slate-200 ml-1">최적화됨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            Generated Files
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-3">
              {details.result.audioKey && (
                <div className="flex items-center justify-between rounded bg-slate-700/50 p-3">
                  <div>
                    <div className="font-medium text-slate-200">
                      AI Voice Cover
                    </div>
                    <div className="text-sm text-slate-400">
                      Main processed audio file
                    </div>
                  </div>
                </div>
              )}

              {details.result.vocalsKey && (
                <div className="flex items-center justify-between rounded bg-slate-700/50 p-3">
                  <div>
                    <div className="font-medium text-slate-200">
                      Vocals Track
                    </div>
                    <div className="text-sm text-slate-400">
                      Separated vocal track
                    </div>
                  </div>
                </div>
              )}

              {details.result.instrumentalsKey && (
                <div className="flex items-center justify-between rounded bg-slate-700/50 p-3">
                  <div>
                    <div className="font-medium text-slate-200">
                      Instrumental Track
                    </div>
                    <div className="text-sm text-slate-400">
                      Separated instrumental track
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
