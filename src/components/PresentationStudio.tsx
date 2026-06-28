import React, { useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { Layout, MessageSquare, Clock, ArrowRight, Loader2, Play } from "lucide-react";

export const PresentationStudio = () => {
  const { currentProject, setCurrentProject } = useAppStore();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const slides = currentProject?.presentation?.slides || [];
  const currentSlide = slides[activeSlide];

  const prepareDefense = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-defense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentation: currentProject?.presentation }),
      });
      const defenseData = await res.json();
      
      if (!res.ok) throw new Error(defenseData.error);

      setCurrentProject({
        ...currentProject,
        defense: defenseData
      });

      navigate("/defense");
    } catch (error) {
       console.error(error);
       alert("Failed to prepare defense.");
    } finally {
       setIsGenerating(false);
    }
  };

  if (!slides.length) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">No presentation generated yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Sidebar: Slide List */}
      <div className="w-64 border-r border-white/5 bg-black/10 backdrop-blur-md overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Slides ({slides.length})</h3>
        </div>
        <div className="p-2 space-y-2">
          {slides.map((slide: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${activeSlide === index ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <div className="text-xs font-medium mb-1">Slide {index + 1}</div>
              <div className="truncate font-medium text-sm text-gray-200">{slide.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Slide Preview & Editor */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-black/10 backdrop-blur-md">
          <h2 className="font-semibold text-white">Presentation Blueprint</h2>
          <button 
            onClick={prepareDefense}
            disabled={isGenerating}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Defense Coach</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-transparent">
          {/* Slide Preview Canvas */}
          <div className="w-full max-w-3xl aspect-video bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{currentSlide?.title}</h1>
              <ul className="space-y-4">
                {currentSlide?.keywords?.map((kw: string, i: number) => (
                  <li key={i} className="text-xl text-gray-700 flex items-start">
                    <span className="mr-3 text-cyan-600">•</span>
                    {kw}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 p-4 text-sm text-gray-500 flex justify-between">
              <span>{currentSlide?.suggestedLayout || "Standard Layout"}</span>
              <span>Slide {activeSlide + 1}</span>
            </div>
          </div>
        </div>

        {/* Bottom Panel: Speaker Notes */}
        <div className="h-64 border-t border-white/5 bg-black/10 backdrop-blur-md p-6 overflow-y-auto">
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="font-semibold text-white flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Speaker Notes</h3>
            <span className="text-sm text-gray-400 flex items-center"><Clock className="w-4 h-4 mr-1" /> {currentSlide?.estimatedDuration}</span>
          </div>
          <div className="text-gray-300 space-y-4 max-w-3xl">
            <div>
              <strong className="text-cyan-400 block mb-1">Objective:</strong>
              {currentSlide?.slideObjective}
            </div>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-cyan-500 h-32"
              defaultValue={currentSlide?.presenterNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
