export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#111827] rounded-2xl p-5 border border-[#1e293b]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg skeleton" />
              <div className="h-3 w-20 skeleton" />
            </div>
            <div className="h-8 w-24 skeleton mb-2" />
            <div className="h-3 w-16 skeleton" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#111827] rounded-2xl p-5 border border-[#1e293b]/60 h-72">
            <div className="h-4 w-32 skeleton mb-6" />
            <div className="h-52 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
