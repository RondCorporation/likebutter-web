'use client';

interface ButterCoverClientProps {
  dictionary: any;
}

export default function ButterCoverClient({ dictionary }: ButterCoverClientProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl text-slate-300">_components</h1>
    </div>
  );
}
