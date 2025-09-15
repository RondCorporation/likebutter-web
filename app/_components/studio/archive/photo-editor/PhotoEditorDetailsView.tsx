import { PhotoEditorDetails } from '@/types/task';
import { Edit3, Image, Sliders, Filter, Sun, Contrast, Palette, Download } from 'lucide-react';

interface Props {
  details?: PhotoEditorDetails;
}

export default function PhotoEditorDetailsView({ details }: Props) {
  if (!details) {
    return <p className="text-slate-400">No details available</p>;
  }

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Edit3 className="h-5 w-5" />
          Photo Editor Configuration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Edit3 className="h-4 w-4" />
              Edit Type
            </label>
            <p className="text-slate-200">{details.request.editType || 'Basic Enhancement'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              Applied Filter
            </label>
            <p className="text-slate-200">{details.request.applyFilter || 'None'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4" />
              Brightness
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                <div
                  className="bg-butter-yellow h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.brightness + 100) / 200) * 100))}%`
                  }}
                />
              </div>
              <span className="text-slate-200 text-sm w-12 text-right">
                {details.request.brightness > 0 ? '+' : ''}{details.request.brightness}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Contrast className="h-4 w-4" />
              Contrast
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                <div
                  className="bg-butter-yellow h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.contrast + 100) / 200) * 100))}%`
                  }}
                />
              </div>
              <span className="text-slate-200 text-sm w-12 text-right">
                {details.request.contrast > 0 ? '+' : ''}{details.request.contrast}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4" />
              Saturation
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                <div
                  className="bg-butter-yellow h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.saturation + 100) / 200) * 100))}%`
                  }}
                />
              </div>
              <span className="text-slate-200 text-sm w-12 text-right">
                {details.request.saturation > 0 ? '+' : ''}{details.request.saturation}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
              <Sliders className="h-4 w-4" />
              Quality Enhancement
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${details.request.enhanceQuality ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="text-slate-200">{details.request.enhanceQuality ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Image */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Image className="h-5 w-5" />
          Source Image
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="w-full h-64 bg-slate-700 rounded flex items-center justify-center">
            <span className="text-slate-400">Original Image Preview</span>
          </div>
          {details.request.sourceImageKey && (
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Key: {details.request.sourceImageKey}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            Edited Result
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-4">
              {/* Before/After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Original</h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center">
                    <span className="text-slate-400 text-sm">Original Image</span>
                  </div>
                  {details.result.originalImageKey && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {details.result.originalImageKey}
                    </p>
                  )}
                </div>

                <div>
                  <h5 className="text-sm font-medium text-slate-400 mb-2">Edited</h5>
                  <div className="w-full h-48 bg-slate-700 rounded flex items-center justify-center border-2 border-butter-yellow/30">
                    <span className="text-slate-400 text-sm">Edited Result</span>
                  </div>
                  {details.result.editedImageKey && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {details.result.editedImageKey}
                    </p>
                  )}
                </div>
              </div>

              {/* Applied Settings Summary */}
              <div className="pt-4 border-t border-slate-700">
                <h5 className="text-sm font-medium text-slate-400 mb-3">Applied Adjustments</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Brightness</div>
                    <div className={`font-medium ${details.request.brightness > 0 ? 'text-yellow-400' : details.request.brightness < 0 ? 'text-blue-400' : 'text-slate-300'}`}>
                      {details.request.brightness > 0 ? '+' : ''}{details.request.brightness}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Contrast</div>
                    <div className={`font-medium ${details.request.contrast > 0 ? 'text-purple-400' : details.request.contrast < 0 ? 'text-gray-400' : 'text-slate-300'}`}>
                      {details.request.contrast > 0 ? '+' : ''}{details.request.contrast}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Saturation</div>
                    <div className={`font-medium ${details.request.saturation > 0 ? 'text-pink-400' : details.request.saturation < 0 ? 'text-gray-400' : 'text-slate-300'}`}>
                      {details.request.saturation > 0 ? '+' : ''}{details.request.saturation}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Quality</div>
                    <div className={`font-medium ${details.request.enhanceQuality ? 'text-green-400' : 'text-gray-400'}`}>
                      {details.request.enhanceQuality ? 'Enhanced' : 'Normal'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Information */}
              {details.request.applyFilter && details.request.applyFilter !== 'None' && (
                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm font-medium text-slate-400">
                    Applied Filter
                  </label>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-butter-yellow/20 text-butter-yellow rounded-full text-sm">
                    <Filter className="h-3 w-3" />
                    {details.request.applyFilter}
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
          <Sliders className="h-5 w-5" />
          Processing Details
        </h4>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-slate-400">Edit Type</label>
              <p className="text-slate-200">{details.request.editType}</p>
            </div>

            <div>
              <label className="text-slate-400">Quality Enhancement</label>
              <p className="text-slate-200">{details.request.enhanceQuality ? 'Applied' : 'Not Applied'}</p>
            </div>

            <div>
              <label className="text-slate-400">Source Image</label>
              <p className="text-slate-200 font-mono text-xs">{details.request.sourceImageKey}</p>
            </div>

            {details.result?.editedImageKey && (
              <div>
                <label className="text-slate-400">Result Image</label>
                <p className="text-slate-200 font-mono text-xs">{details.result.editedImageKey}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}