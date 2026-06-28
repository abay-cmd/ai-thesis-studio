import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, BrainCircuit, Presentation, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Continue building your thesis presentation.</p>
        </div>
        <button 
          onClick={() => navigate("/project/new")}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatusCard icon={<FileText />} title="Thesis Analyzed" value="0" />
        <StatusCard icon={<BrainCircuit />} title="Mind Maps" value="0" />
        <StatusCard icon={<Presentation />} title="Presentations" value="0" />
        <StatusCard icon={<ShieldAlert />} title="Practice Sessions" value="0" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center">
            <Plus className="w-12 h-12 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">No projects yet.</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Create your first thesis project and start building your presentation journey.
        </p>
        <button 
          onClick={() => navigate("/project/new")}
          className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Create Project
        </button>
      </div>
    </div>
  );
};

const StatusCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-4 backdrop-blur-md">
    <div className="p-3 bg-white/10 rounded-lg text-cyan-400">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);
