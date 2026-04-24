export default function Issues({ issues }) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
      <h2 className="mb-3 font-semibold text-red-400">Issues</h2>

      Issue: {issues}
    </div>
  );
}