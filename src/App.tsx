import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from '@/components/layout/AppLayout';
import { LandingPage } from '@/components/LandingPage';
import { LoginPage } from '@/components/LoginPage';
import { Dashboard } from '@/components/Dashboard';
import { ProjectWizard } from '@/components/ProjectWizard';
import { MindMapStudio } from '@/components/MindMapStudio';
import { PresentationStudio } from '@/components/PresentationStudio';
import { DefenseCoach } from '@/components/DefenseCoach';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="project/new" element={<ProtectedRoute><ProjectWizard /></ProtectedRoute>} />
          <Route path="mindmap" element={<ProtectedRoute><MindMapStudio /></ProtectedRoute>} />
          <Route path="presentation" element={<ProtectedRoute><PresentationStudio /></ProtectedRoute>} />
          <Route path="defense" element={<ProtectedRoute><DefenseCoach /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
