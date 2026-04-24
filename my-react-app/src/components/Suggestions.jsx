export default function Suggestions({ title, data }) {
  return (
    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl my-8">
      <h2 className="mb-3 font-semibold text-green-400">{title}</h2>
      {data?.map((s, idx) => (
        <p key={idx}>💡 {s}</p>
      ))}
    </div>
  );
}