import { ButterTestDetails } from '@/types/task';

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="col-span-2 text-sm text-white break-words">
      {value || '-'}
    </dd>
  </div>
);

export default function ButterTestDetailsView({
  details,
}: {
  details?: ButterTestDetails;
}) {
  if (!details?.request) {
    return <p>Request details not available.</p>;
  }
  const { request } = details;
  return (
    <dl>
      <DetailRow label="Prompt" value={request.prompt} />
    </dl>
  );
}
