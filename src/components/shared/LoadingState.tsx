const LoadingState = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl shimmer bg-gray-50 border border-gray-100"
        style={{ height: i === 0 ? "4rem" : i === 1 ? "6rem" : "5rem" }}
      />
    ))}
  </div>
);

export default LoadingState;
