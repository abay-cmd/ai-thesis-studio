import React from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store";
import { logout } from "@/lib/firebase";
import { BrainCircuit, LogOut, LayoutDashboard } from "lucide-react";
import { cnUtils } from "@/lib/utils";

export const Navbar = () => {
  const { user } = useAppStore();

  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-black/10 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Thesis Studio</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
