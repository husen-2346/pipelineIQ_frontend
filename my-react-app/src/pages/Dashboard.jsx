import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";

/* -------------------- Download helper -------------------- */
const downloadYaml = (content, filename = "optimized-pipeline.yml") => {
  const blob = new Blob([content], { type: "application/x-yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* -------------------- UI Components -------------------- */
function MetricCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-[11px] uppercase text-gray-500 font-mono mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold font-mono text-white">
        {value ?? "—"}
      </p>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-5">
      <h2 className="text-[11px] uppercase text-gray-500 font-mono mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* -------------------- Dashboard -------------------- */
export default function Dashboard() {
  const { state } = useLocation();
  const initialData = state || {};

  const [aiYaml, setAiYaml] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [improvement, setImprovement] = useState(0);
  const [loading, setLoading] = useState(true);

  const requestId = initialData.requestId;

  /* -------------------- Poll AI -------------------- */
  useEffect(() => {
    if (!requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/ai-result/${requestId}`
        );

        if (res.data.status === "done") {
          setAiYaml(res.data.aiOptimizedYaml);
          setAiSuggestions(res.data.aiSuggestions || []);
          setImprovement(res.data.improvement || 0);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [requestId]);

  if (!state) return <div>No data</div>;

  /* -------------------- Derived -------------------- */
  const jobs = Object.entries(state.parsed?.jobs || {}).map(([k, j]) => ({
    name: k,
    steps: j.steps?.length || 0,
  }));

  const stepsData = jobs.map((j) => ({
    job: j.name,
    steps: j.steps,
  }));

  const issues = state.suggestions || [];
  const aiList = aiSuggestions;

  const execution = state.execution || {};
  const layers = execution.layers || [];

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto">
      {loading && (
        <p className="text-blue-400 animate-pulse mb-4">
          ⚡ AI optimizing your pipeline...
        </p>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <MetricCard label="Time" value={`${state.estimatedTime}s`} />
        <MetricCard label="Execution" value={state.execution?.type} />
        <MetricCard label="Jobs" value={jobs.length} />
        <MetricCard label="Issues" value={issues.length} />
      </div>

      {/* Chart */}
      <SectionCard title="Steps per job">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stepsData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="job" width={80} />
            <Bar dataKey="steps" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Execution Layers */}
      <SectionCard title="Execution Flow (DAG)">
        {layers.length ? (
          <div className="flex flex-col gap-3">
            {layers.map((layer, i) => (
              <div key={i}>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-500 w-16">
                    Stage {i + 1}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {layer.map((job) => (
                      <span
                        key={job}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-mono"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>

                {i < layers.length - 1 && (
                  <div className="ml-16 text-gray-600">↓</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No execution data</p>
        )}
      </SectionCard>

      {/* Issues */}
      <SectionCard title="Issues">
        {issues.map((i, idx) => (
          <p key={idx} className="text-sm text-gray-300">
            • {i.message}
          </p>
        ))}
      </SectionCard>

      {/* AI Suggestions */}
      <SectionCard title="AI Suggestions">
        {aiList.length ? (
          aiList.map((s, i) => (
            <p key={i} className="text-sm text-gray-300">
              {i + 1}. {s.issue}
            </p>
          ))
        ) : (
          <p className="text-gray-500">
            {loading ? "Generating..." : "None"}
          </p>
        )}
      </SectionCard>

      {/* YAML */}
      <SectionCard title="AI Optimized YAML">
        {loading ? (
          <p className="text-blue-400 animate-pulse">Generating YAML...</p>
        ) : aiYaml ? (
          <>
            <button
              onClick={() => downloadYaml(aiYaml)}
              className="mb-3 text-blue-400"
            >
              Download YAML
            </button>
            <pre className="bg-black p-3 text-xs overflow-auto">
              {aiYaml}
            </pre>
          </>
        ) : (
          <p className="text-gray-500">Failed</p>
        )}
      </SectionCard>
    </div>
  );
}