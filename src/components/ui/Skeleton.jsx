const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${variants[variant]} ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" className="w-1/2" />
  </div>
);

export const JournalListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="title" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
