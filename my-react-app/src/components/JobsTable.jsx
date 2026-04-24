export default function JobsTable({ jobs }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      <h2 className="mb-3 font-semibold">Jobs</h2>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            {/* Explicitly align text left with 'text-left' and add padding 'pb-2' */}
            <th className="text-left font-medium pb-2 pr-4">Job</th>
            <th className="text-left font-medium pb-2">Steps</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {jobs.map((job, i) => (
            <tr key={i} className="hover:bg-gray-800/50 transition-colors">
              {/* 'py-3' adds vertical space, 'pr-4' ensures the name doesn't touch the steps count */}
              <td className="py-3 pr-4 align-top">{job.name}</td>
              <td className="py-3 align-top">{job.steps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
