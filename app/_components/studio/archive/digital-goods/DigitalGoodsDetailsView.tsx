import { DigitalGoodsDetails } from '@/types/task';
import { Image, Download, Palette, Type } from 'lucide-react';

interface Props {
  details?: DigitalGoodsDetails;
}

export default function DigitalGoodsDetailsView({ details }: Props) {
  if (!details) {
    return <p className="text-slate-400">No details available</p>;
  }

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <Palette className="h-5 w-5" />
          Digital Goods Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4">
          {details.request.style && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Style
              </label>
              <p className="text-slate-200 capitalize">{details.request.style}</p>
            </div>
          )}

          {details.request.title && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Title
              </label>
              <p className="text-slate-200">{details.request.title}</p>
            </div>
          )}

          {details.request.subtitle && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Subtitle
              </label>
              <p className="text-slate-200">{details.request.subtitle}</p>
            </div>
          )}

          {details.request.accentColor && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-slate-600"
                  style={{ backgroundColor: details.request.accentColor }}
                />
                <p className="text-slate-200">{details.request.accentColor}</p>
              </div>
            </div>
          )}

          {details.request.productName && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Product Name
              </label>
              <p className="text-slate-200">{details.request.productName}</p>
            </div>
          )}

          {details.request.brandName && (
            <div>
              <label className="text-sm font-medium text-slate-400">
                Brand Name
              </label>
              <p className="text-slate-200">{details.request.brandName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Prompt */}
      {details.request.customPrompt && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Type className="h-5 w-5" />
            Custom Prompt
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-slate-200">{details.request.customPrompt}</p>
          </div>
        </div>
      )}

      {/* Source Image */}
      {details.request.imageUrl && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Image className="h-5 w-5" />
            Source Image
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <img
              src={details.request.imageUrl}
              alt="Source image"
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {details.result && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
            <Download className="h-5 w-5" />
            Generated Digital Goods
          </h4>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <div className="space-y-4">
              {/* Result Image */}
              {details.result.imageUrl && (
                <div>
                  <img
                    src={details.result.imageUrl}
                    alt="Generated digital goods"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                {details.result.filename && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Filename
                    </label>
                    <p className="text-slate-200">{details.result.filename}</p>
                  </div>
                )}

                {details.result.fileSize && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      File Size
                    </label>
                    <p className="text-slate-200">
                      {(details.result.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {details.result.executionTime && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">
                      Execution Time
                    </label>
                    <p className="text-slate-200">
                      {details.result.executionTime.toFixed(1)}s
                    </p>
                  </div>
                )}
              </div>

              {/* Style Information */}
              {details.result.style && (
                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm font-medium text-slate-400">
                    Applied Style
                  </label>
                  <p className="text-slate-200 capitalize">{details.result.style}</p>
                </div>
              )}

              {/* Prompt Used */}
              {details.result.promptUsed && (
                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm font-medium text-slate-400">
                    Final Prompt Used
                  </label>
                  <p className="text-slate-200 text-sm bg-slate-700/50 p-3 rounded mt-2">
                    {details.result.promptUsed}
                  </p>
                </div>
              )}

              {/* Download Link */}
              {details.result.downloadUrl && (
                <div className="pt-4 border-t border-slate-700">
                  <a
                    href={details.result.downloadUrl}
                    download={details.result.filename}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-butter-yellow text-black rounded hover:bg-butter-orange transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Result
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Information */}
      {details.error && (
        <div>
          <h4 className="mb-3 font-semibold text-red-400">
            Error Details
          </h4>
          <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-4">
            <p className="text-red-300">{details.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}