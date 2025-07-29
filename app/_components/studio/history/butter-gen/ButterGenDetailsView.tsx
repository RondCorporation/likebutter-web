import { ButterGenDetails } from '@/types/task';

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="col-span-2 text-sm text-white break-words">
      {value || '-'}
    </dd>
  </div>
);

export default function ButterGenDetailsView({
  details,
}: {
  details?: ButterGenDetails;
}) {
  if (!details?.request) {
    return <p>Request details not available.</p>;
  }
  const { request } = details;
  return (
    <dl>
      <DetailRow label="Idol Name" value={request.idolName} />
      <DetailRow label="Prompt" value={request.prompt} />
      <DetailRow label="Image Count" value={request.imageCount} />
      <DetailRow
        label="Dimensions"
        value={`${request.width} x ${request.height}`}
      />
      <DetailRow
        label="Source Image"
        value={
          request.sourceImageUrl ? (
            <a
              href={request.sourceImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              View Image
            </a>
          ) : (
            'Not provided'
          )
        }
      />
    </dl>
  );
}
