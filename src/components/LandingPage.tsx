import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Presentation, Zap } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              <span className="block text-gray-400 mb-2">Think First.</span>
              <span className="block text-gray-200 mb-2">Present Better.</span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
                Master Your Thesis Defense with AI.
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            Transform your thesis into an interactive mind map, presentation blueprint, speaker notes, and defense practice — all in one intelligent workspace.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center space-x-4 pt-4"
          >
            <Link 
              to="/login"
              className="bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all hover:scale-105"
            >
              Start Free
            </Link>
            <a 
              href="#features"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all"
            >
              Watch Demo
            </a>
          </motion.div>
        </div>

        <div id="features" className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-indigo-400" />}
            title="Visual Thinking"
            description="AI analyzes your thesis and builds an interactive conceptual mind map, ensuring you understand the core relationships before making a single slide."
          />
          <FeatureCard 
            icon={<Presentation className="w-8 h-8 text-blue-400" />}
            title="Presentation Blueprint"
            description="Automatically distill your mind map into a 7-slide academic presentation structure with intelligent speaker notes."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-amber-400" />}
            title="Defense Coach"
            description="Simulate your thesis defense. AI predicts examiner questions based on your methodology and findings, and provides instant feedback."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);
