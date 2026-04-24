import { useLocation } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import JobsTable from "../components/JobsTable";
import Issues from "../components/Issues";
import Suggestions from "../components/Suggestions";

export default function Dashboard() {
  const { state } = useLocation();

  if (!state) return <div className="pt-32 text-center">No Data</div>;

  const jobsArray = Object.entries(state.parsed.jobs).map(([name, job]) => ({
    name,
    steps: job.steps.length,
  }));

  const transformedData = {
    estimated_time: state.estimatedTime,
    execution: state.execution,
    total_jobs: jobsArray.length,
    issues: state.suggestions.length,
    jobs: jobsArray,
    suggestions: state.suggestions.map((s) => s.message),
    ai_suggestions: [],
  };

  return (
    <div className="min-h-screen pt-28 px-6">
      <SummaryCards data={transformedData} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <JobsTable jobs={transformedData.jobs} />
        <Issues issues={transformedData.issues} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Suggestions title="Suggestions" data={transformedData.suggestions} />
        <Suggestions
          title="AI Suggestions"
          data={transformedData.ai_suggestions}
        />
      </div>
    </div>
  );
}
