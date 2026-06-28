import React, { useState } from "react";
import { useAppStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, ChevronRight, RefreshCcw } from "lucide-react";

export const DefenseCoach = () => {
  const { currentProject } = useAppStore();
  const questions = currentProject?.defense?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questions.length) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">No defense simulation generated yet.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-amber-500" />
            Defense Simulation
          </h1>
          <p className="text-gray-400">Practice answering common examiner questions.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-400 mb-1">Progress</div>
          <div className="text-xl font-bold text-white">{currentIndex + 1} / {questions.length}</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-8 border-b border-white/5 bg-black/10">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              {currentQ.category}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
              currentQ.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
              currentQ.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-medium text-white leading-relaxed">
            "{currentQ.question}"
          </h2>
          <div className="mt-4 text-gray-500 text-sm italic">
            <strong>Examiner Intent:</strong> {currentQ.reason}
          </div>
        </div>

        <div className="p-8 bg-transparent min-h-[300px]">
          {!showAnswer ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <p className="text-gray-400 text-lg">Take a moment to formulate your answer aloud.</p>
              <button 
                onClick={() => setShowAnswer(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Reveal AI Suggested Answer
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Suggested Answer Structure</h4>
                <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                  {currentQ.suggestedAnswer}
                </p>
              </div>
              <div>
                <h4 className="text-amber-400 font-semibold mb-2 flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> Improvement Tips</h4>
                <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
                  <li>{currentQ.improvementTips}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/10 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-gray-400 hover:text-white px-4 py-2 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-cyan-500/20"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
