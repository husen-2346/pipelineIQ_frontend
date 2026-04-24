export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <Card title="Time" value={`${data.estimated_time}s`} />
      <Card title="Execution" value={data.execution} />
      <Card title="Jobs" value={data.total_jobs} />
      <Card title="Issues" value={data.issues} />

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
