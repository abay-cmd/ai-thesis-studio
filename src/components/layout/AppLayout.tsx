import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAppStore } from "@/store";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-48 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px]"></div>
      </div>
      <Navbar />
      <main className="pt-16 flex-1 z-10 relative">
        <Outlet />
      </main>
    </div>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
