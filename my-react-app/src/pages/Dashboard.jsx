import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { state } = useLocation();

  if (!state) return <div className="pt-32 text-center text-white">No Data</div>;

  // Normalize jobs
  const jobs = Object.entries(state.parsed?.jobs || {}).map(
    ([key, job]) => ({
      name: key,
      steps: job.steps?.length || 0,
    })
  );


  // Convert jobs → chart data
  const stepsData = jobs.map((j) => ({
    job: j.name,
    steps: j.steps,
    fill: "#3b82f6",
  }));

  // Merge suggestions (important fix)
  const aiList =
    typeof state.ai_suggestions === "string"
      ? state.ai_suggestions.split("\n").filter(Boolean)
      : state.ai_suggestions || [];

  const allSuggestions = [
    ...(state.suggestions || []),
    ...aiList,
  ];

  return (
    <div className="pt-28 px-6 text-white pb-4">

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Card label="Time" value={`${state.estimatedTime}s`} />
        <Card label="Execution" value={state.execution?.type} />
        <Card label="Jobs" value={jobs.length} />
        <Card label="Issues" value={(state.suggestions || []).length} red />      </div>

      {/* JOBS + CHART */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">

        {/* Jobs Table */}
        <div className="card  mb-4 border border-blue-500/20 bg-blue-500/5 p-4">
          <h2 className="section-title">Jobs</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs">
                <th className="text-left">Name</th>
                <th className="text-right">Steps</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.name} className="border-t border-white/10">
                  <td className="py-2">{j.name}</td>
                  <td className="py-2 text-right">{j.steps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Bar Chart */}
        <div className="card mb-4 border border-blue-500/20 bg-blue-500/5 p-4">
          <h2 className="section-title">Steps per Job</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stepsData}>
              <XAxis dataKey="job" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Bar dataKey="steps" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 ISSUES */}
      <div className="card mb-4 border border-red-500/20 bg-red-500/5 p-4">
        <h2 className="section-title text-red-400">Issues</h2>

        {(state.suggestions || []).map((issue, i) => {
          const text =
            typeof issue === "string"
              ? issue
              : issue.message || issue.details || JSON.stringify(issue);

          return <p key={i}>&#9679; {text}</p>;
        })}
      </div>

      {/* 🔹 SINGLE SUGGESTION BOX */}
      <div className="card border border-green-500/20 bg-green-500/5 p-4">
        <h2 className="section-title text-green-400">Suggestions</h2>

        {allSuggestions.map((s, i) => {
          const text =
            typeof s === "string"
              ? s
              : s.message || s.details || s.text || JSON.stringify(s);

          return <p key={i}> &#9679; {text}</p>;
        })}
      </div>
    </div>
  );
}

// 🔹 SMALL CARD COMPONENT
function Card({ label, value, red }) {
  const displayValue =
    typeof value === "object"
      ? value?.type || JSON.stringify(value)
      : value;

  return (
    <div className="card">
      <p className="text-xs text-gray-400">{label}</p>
      <h2 className={`text-2xl font-bold ${red ? "text-red-400" : ""}`}>
        {displayValue}
      </h2>
    </div>
  );
}