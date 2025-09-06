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
          <h4 className="mb-3 font-semibold text-slate-200">Advanced AI Settings</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-slate-800/50 p-4">
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
          </div>
        </div>
      )}

      {/* Reverb Settings */}
      {(details.request.reverbRmSize !== undefined ||
        details.request.reverbWet !== undefined ||
        details.request.reverbDry !== undefined ||
        details.request.reverbDamping !== undefined) && (
        <div>
          <h4 className="mb-3 font-semibold text-slate-200">Reverb Settings</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-slate-800/50 p-4">
            {details.request.reverbRmSize !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Room Size</label>
                <p className="text-slate-200">{details.request.reverbRmSize}</p>
              </div>
            )}
            
            {details.request.reverbWet !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Wet</label>
                <p className="text-slate-200">{details.request.reverbWet}</p>
              </div>
            )}
            
            {details.request.reverbDry !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Dry</label>
                <p className="text-slate-200">{details.request.reverbDry}</p>
              </div>
            )}
            
            {details.request.reverbDamping !== undefined && (
              <div>
                <label className="text-sm font-medium text-slate-400">Damping</label>
                <p className="text-slate-200">{details.request.reverbDamping}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
                    <div className="font-medium text-slate-200">AI Voice Cover</div>
                    <div className="text-sm text-slate-400">Main processed audio file</div>
                  </div>
                </div>
              )}
              
              {details.result.vocalsKey && (
                <div className="flex items-center justify-between rounded bg-slate-700/50 p-3">
                  <div>
                    <div className="font-medium text-slate-200">Vocals Track</div>
                    <div className="text-sm text-slate-400">Separated vocal track</div>
                  </div>
                </div>
              )}
              
              {details.result.instrumentalsKey && (
                <div className="flex items-center justify-between rounded bg-slate-700/50 p-3">
                  <div>
                    <div className="font-medium text-slate-200">Instrumental Track</div>
                    <div className="text-sm text-slate-400">Separated instrumental track</div>
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