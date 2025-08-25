export default function StudioToolSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 bg-slate-700 rounded w-1/2"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-32 bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  );
}