/**
 * Application Entry Point
 *
 * Sets up routing, lazy loading, and error boundaries
 */

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './index.css';

// Lazy load route components for code splitting
const Home = lazy(() => import('./routes/home/index'));
const Missions = lazy(() => import('./routes/build/missions/index'));
const LuxBuilder = lazy(() => import('./routes/studio/lux/index'));
const Automations = lazy(() => import('./routes/studio/automations/index'));
const NarrativeBuilder = lazy(() => import('./routes/studio/narrative/index'));
const AgentRoster = lazy(() => import('./routes/studio/agents/index'));
const Templates = lazy(() => import('./routes/library/templates'));
const Knowledge = lazy(() => import('./routes/library/knowledge'));
const Spaces = lazy(() => import('./routes/spaces/index'));
const Chat = lazy(() => import('./routes/chat/index'));

// Cognate routes
const Cognates = lazy(() => import('./routes/studio/cognates/index'));
const CognateSOPs = lazy(() => import('./routes/studio/cognates/[id]/sops'));
const NewSOP = lazy(() => import('./routes/studio/cognates/[id]/sops/new'));
const EditSOP = lazy(() => import('./routes/studio/cognates/[id]/sops/[sopId]'));
const SOPEdit = lazy(() => import('./routes/studio/cognates/[id]/sops/edit'));
const SOPRules = lazy(() => import('./routes/studio/cognates/[id]/sops/rules'));
const SOPValidate = lazy(() => import('./routes/studio/cognates/[id]/sops/validate'));
const CognateBootstrap = lazy(() => import('./routes/studio/cognates/[id]/bootstrap'));
const CognatePacks = lazy(() => import('./routes/studio/cognates/[id]/packs'));

// Loading fallback component
function RouteLoading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-symtex-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Coming Soon placeholder page
function ComingSoon({ title }: { title: string }): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-symtex-primary/10 flex items-center justify-center">
          <span className="text-3xl">🚀</span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
        <p className="text-slate-400">This feature is coming soon!</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Dashboard */}
          <Route
            index
            element={
              <Suspense fallback={<RouteLoading />}>
                <Home />
              </Suspense>
            }
          />

          {/* Build Section */}
          <Route
            path="missions"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Missions />
              </Suspense>
            }
          />

          {/* Studio Section */}
          <Route
            path="studio/lux"
            element={
              <Suspense fallback={<RouteLoading />}>
                <LuxBuilder />
              </Suspense>
            }
          />
          <Route
            path="studio/automations"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Automations />
              </Suspense>
            }
          />
          <Route
            path="studio/narrative"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NarrativeBuilder />
              </Suspense>
            }
          />
          <Route
            path="studio/agents"
            element={
              <Suspense fallback={<RouteLoading />}>
                <AgentRoster />
              </Suspense>
            }
          />

          {/* Cognate Routes */}
          <Route
            path="studio/cognates"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Cognates />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateSOPs />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/new"
            element={
              <Suspense fallback={<RouteLoading />}>
                <NewSOP />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <EditSOP />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/edit"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPEdit />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/rules"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPRules />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/sops/:sopId/validate"
            element={
              <Suspense fallback={<RouteLoading />}>
                <SOPValidate />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/bootstrap"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognateBootstrap />
              </Suspense>
            }
          />
          <Route
            path="studio/cognates/:id/packs"
            element={
              <Suspense fallback={<RouteLoading />}>
                <CognatePacks />
              </Suspense>
            }
          />

          {/* Library Section */}
          <Route
            path="library/templates"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Templates />
              </Suspense>
            }
          />
          <Route
            path="library/knowledge"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Knowledge />
              </Suspense>
            }
          />

          {/* Spaces Section */}
          <Route
            path="spaces"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />
          <Route
            path="spaces/:domainId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />
          <Route
            path="spaces/:domainId/:projectId"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Spaces />
              </Suspense>
            }
          />

          {/* Chat Section */}
          <Route
            path="chat"
            element={
              <Suspense fallback={<RouteLoading />}>
                <Chat />
              </Suspense>
            }
          />

          {/* Coming Soon Routes */}
          <Route path="dna" element={<ComingSoon title="DNA Analytics" />} />
          <Route path="analytics" element={<ComingSoon title="Analytics Dashboard" />} />
          <Route path="conversations" element={<Navigate to="/chat" replace />} />
          <Route path="settings" element={<ComingSoon title="Settings" />} />

          {/* Legacy redirects */}
          <Route path="activity" element={<Navigate to="/" replace />} />
          <Route path="build" element={<Navigate to="/missions" replace />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                  <p className="text-slate-400">Page not found</p>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
