import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadPage() {
  const [yaml, setYaml] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [fileName, setFileName] = useState(""); 
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".yaml") && !file.name.endsWith(".yml")) {
      alert("Upload .yaml file only");
      return;
    }

    setFileName(file.name); 

    const reader = new FileReader();
    reader.onload = (e) => setYaml(e.target.result);
    reader.readAsText(file);
  };

  // Analyze
  const handleAnalyze = async () => {
    if (!yaml.trim()) return alert("Add YAML first");

    try {
      const res = await axios.post("http://localhost:8080/api/parse", {
        yamlContent: yaml,
        withCredentials: true 
      }); 
      
      console.log(res?.data)
      navigate("/dashboard", { state: res.data });

    } catch {
      // fallback demo mode
      navigate("/dashboard", {
        state: {
          estimated_time: res?.data?.estimatedTime,
          execution: "sequential",
          total_jobs: res?.data?.parsed.length,
          jobs: res?.data?.parsed,
          issues: ["Dependency chain detected"],
          suggestions: res?.data?.suggestions,
          ai_suggestions: ["Reduce dependencies"],
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">

      {/* TITLE */}
      <h1 className="text-5xl md:text-6xl font-bold text-center leading-tight">
        Analyze your <br />
        <span className="text-blue-500">CI/CD</span> pipeline
      </h1>

      <p className="mt-4 text-gray-400 text-center max-w-lg">
        Paste or upload your YAML file and get instant insights.
      </p>

      {/* MAIN CARD */}
      <div className="mt-10 w-full max-w-2xl 
        bg-white/5 backdrop-blur-lg border border-white/10 
        rounded-2xl p-6 shadow-xl">

        {/* TABS */}
        <div className="flex mb-5">
          <button
            onClick={() => {
              setActiveTab("paste");
              setFileName(""); // reset
            }}
            className={`flex-1 pb-2 text-sm ${
              activeTab === "paste"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            Paste YAML
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 pb-2 text-sm ${
              activeTab === "upload"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            Upload File
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === "paste" ? (
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            placeholder="# Paste your YAML here..."
            className="w-full h-44 p-4 rounded-xl bg-[#0f172a] border border-white/10 text-sm focus:outline-none focus:border-blue-500"
          />
        ) : (
          <label className="flex flex-col items-center justify-center h-44 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-400 transition">

            {fileName ? (
              <>
                <div className="text-green-400 text-2xl">✔</div>
                <p className="mt-2 text-sm">{fileName}</p>
                <p className="text-xs text-gray-400">File uploaded</p>
              </>
            ) : (
              <>
                <div className="text-4xl text-blue-400">+</div>
                <p className="mt-2 text-gray-400 text-sm">
                  Click to upload YAML file
                </p>
              </>
            )}

            <input
              type="file"
              accept=".yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between items-center mt-6">

          <button
            onClick={() =>
              setYaml(`jobs:
  build:
    steps:
      - install
      - test`)
            }
            className="text-sm text-gray-400 hover:text-white"
          >
            + Try Sample YAML
          </button>

          <button
            onClick={handleAnalyze}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            Analyze →
          </button>
        </div>
      </div>
    </div>
  );
}