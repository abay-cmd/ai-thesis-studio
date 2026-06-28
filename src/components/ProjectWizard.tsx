import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useAppStore } from "@/store";

export const ProjectWizard = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { setCurrentProject } = useAppStore();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processThesis = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      // 1. Upload file and extract text
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 2. Analyze Structure
      const analyzeRes = await fetch("/api/analyze-thesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: uploadData.text }),
      });
      const analyzeData = await analyzeRes.json();
      
      if (!analyzeRes.ok) throw new Error(analyzeData.error);

      setAnalysis(analyzeData);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Failed to process thesis. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const generateMindMap = async () => {
    setIsUploading(true);
    try {
      const res = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      const mindmapData = await res.json();
      
      if (!res.ok) throw new Error(mindmapData.error);

      setCurrentProject({
        analysis,
        mindmap: mindmapData
      });

      navigate("/mindmap");
    } catch (error) {
       console.error(error);
       alert("Failed to generate mind map.");
    } finally {
       setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Create New Project</h1>
        <div className="flex items-center justify-center space-x-4">
          <StepIndicator active={step >= 1} number={1} label="Upload" />
          <div className="w-16 h-1 bg-white/10" />
          <StepIndicator active={step >= 2} number={2} label="Review" />
          <div className="w-16 h-1 bg-white/10" />
          <StepIndicator active={step >= 3} number={3} label="Mind Map" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-12 hover:border-cyan-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Upload your thesis</h3>
              <p className="text-gray-400 mb-6">PDF files up to 50MB</p>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload" 
              />
              <label 
                htmlFor="file-upload"
                className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Files
              </label>
              {file && <p className="mt-4 text-cyan-400 font-medium">{file.name}</p>}
            </div>
            <button
              onClick={processThesis}
              disabled={!file || isUploading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Thesis...</span>
                </>
              ) : (
                <span>Analyze Thesis</span>
              )}
            </button>
          </div>
        )}

        {step === 2 && analysis && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Research Structure Detected</h2>
            <div className="bg-black/50 rounded-xl p-6 space-y-4">
              <div>
                <h4 className="text-gray-400 text-sm font-medium">Title</h4>
                <p className="text-white text-lg">{analysis.title}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium">Objectives</h4>
                  <ul className="list-disc list-inside text-white ml-4">
                    {analysis.objectives?.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm font-medium">Findings</h4>
                  <ul className="list-disc list-inside text-white ml-4">
                    {analysis.findings?.map((find: string, i: number) => <li key={i}>{find}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              onClick={generateMindMap}
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Mind Map...</span>
                </>
              ) : (
                <span>Generate Mind Map</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StepIndicator = ({ active, number, label }: { active: boolean, number: number, label: string }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${active ? 'bg-cyan-600 shadow-lg shadow-cyan-500/20 text-white' : 'bg-white/10 text-gray-500'}`}>
      {active && number < 3 ? <CheckCircle className="w-6 h-6" /> : number}
    </div>
    <span className={`text-sm ${active ? 'text-white font-medium' : 'text-gray-500'}`}>{label}</span>
  </div>
);
