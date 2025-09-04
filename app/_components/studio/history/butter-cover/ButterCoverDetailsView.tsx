import { ButterCoverDetails } from '@/types/task';

interface Props {
  details?: ButterCoverDetails;
}

export default function ButterCoverDetailsView({ details }: Props) {
  if (!details) {
    return <p className="text-slate-400">No details available</p>;
  }

  return (
    <div className="space-y-4">
      {/* Request Details */}
      <div>
        <h4 className="mb-2 font-semibold text-slate-200">Request Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Voice Model</label>
            <p className="text-slate-200">{details.request.voiceModel}</p>
          </div>
          
          {details.request.pitchAdjust !== undefined && (
            <div>
              <label className="text-sm font-medium text-slate-400">Pitch Adjust</label>
              <p className="text-slate-200">{details.request.pitchAdjust} semitones</p>
            </div>
          )}
          
          {details.request.outputFormat && (
            <div>
              <label className="text-sm font-medium text-slate-400">Output Format</label>
              <p className="text-slate-200 uppercase">{details.request.outputFormat}</p>
            </div>
          )}
          
          {details.request.separatorModel && (
            <div>
              <label className="text-sm font-medium text-slate-400">Separator Model</label>
              <p className="text-slate-200">{details.request.separatorModel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Settings */}
      {(details.request.indexRate !== undefined || 
        details.request.filterRadius !== undefined ||
        details.request.rmsMixRate !== undefined ||
        details.request.protect !== undefined) && (
        <div>
          <h4 className="mb-2 font-semibold text-slate-200">Advanced Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg bg-slate-800/50 p-4">
            {details.request.indexRate !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Index Rate</label>
                <p className="text-slate-200">{details.request.indexRate}</p>
              </div>
            )}
            
            {details.request.filterRadius !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Filter Radius</label>
                <p className="text-slate-200">{details.request.filterRadius}</p>
              </div>
            )}
            
            {details.request.rmsMixRate !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">RMS Mix Rate</label>
                <p className="text-slate-200">{details.request.rmsMixRate}</p>
              </div>
            )}
            
            {details.request.protect !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Protect</label>
                <p className="text-slate-200">{details.request.protect}</p>
              </div>
            )}
            
            {details.request.f0Method && (
              <div>
                <label className="text-sm font-medium text-slate-400">F0 Method</label>
                <p className="text-slate-200 uppercase">{details.request.f0Method}</p>
              </div>
            )}
            
            {details.request.mainGain !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Main Gain</label>
                <p className="text-slate-200">{details.request.mainGain}dB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intermediate Results */}
      {details.intermediateResult && (
        <div>
          <h4 className="mb-2 font-semibold text-slate-200">Intermediate Files</h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            {details.intermediateResult.vocalsUrl && (
              <div className="mb-2">
                <label className="text-sm font-medium text-slate-400">Vocals</label>
                <p className="text-slate-200 break-all">{details.intermediateResult.vocalsUrl}</p>
              </div>
            )}
            {details.intermediateResult.instrumentalsUrl && (
              <div>
                <label className="text-sm font-medium text-slate-400">Instrumentals</label>
                <p className="text-slate-200 break-all">{details.intermediateResult.instrumentalsUrl}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {details.result && (
        <div>
          <h4 className="mb-2 font-semibold text-slate-200">Generated Result</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
            {details.result.filename && (
              <div>
                <label className="text-sm font-medium text-slate-400">Filename</label>
                <p className="text-slate-200">{details.result.filename}</p>
              </div>
            )}
            
            {details.result.fileSize && (
              <div>
                <label className="text-sm font-medium text-slate-400">File Size</label>
                <p className="text-slate-200">{(details.result.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            
            {details.result.executionTime && (
              <div>
                <label className="text-sm font-medium text-slate-400">Execution Time</label>
                <p className="text-slate-200">{details.result.executionTime.toFixed(1)} seconds</p>
              </div>
            )}
            
            {details.result.downloadUrl && (
              <div className="col-span-full">
                <label className="text-sm font-medium text-slate-400">Download</label>
                <div className="mt-1">
                  <a 
                    href={details.result.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent/90"
                  >
                    Download AI Cover
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job IDs */}
      {(details.separationJobId || details.coverGenerationJobId) && (
        <div>
          <h4 className="mb-2 font-semibold text-slate-200">Job Information</h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            {details.separationJobId && (
              <div className="mb-2">
                <label className="text-sm font-medium text-slate-400">Audio Separation Job ID</label>
                <p className="text-slate-200 font-mono text-sm">{details.separationJobId}</p>
              </div>
            )}
            {details.coverGenerationJobId && (
              <div>
                <label className="text-sm font-medium text-slate-400">AI Cover Generation Job ID</label>
                <p className="text-slate-200 font-mono text-sm">{details.coverGenerationJobId}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {(details.error || details.errorMessage) && (
        <div>
          <h4 className="mb-2 font-semibold text-red-400">Error</h4>
          <div className="rounded-lg bg-red-500/20 p-4">
            <p className="text-red-300">{details.error || details.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}