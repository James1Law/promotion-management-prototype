import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CrewDirectoryPage } from './pages/CrewDirectoryPage';
import { SeafarerProfilePage } from './pages/SeafarerProfilePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { OnboardCrewPage } from './pages/OnboardCrewPage';
import { StubPage } from './pages/StubPage';

/**
 * HashRouter is used deliberately: it makes the prototype work as a static
 * SPA on Vercel / GitHub Pages with no server rewrite needed, and lets the
 * "open in new tab" deep links (#/seafarer/:id/evaluations) resolve directly.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CrewDirectoryPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/onboard" element={<OnboardCrewPage />} />
        <Route path="/seafarer/:id" element={<SeafarerProfilePage />} />
        <Route path="/seafarer/:id/evaluations" element={<StubPage kind="evaluations" />} />
        <Route path="/seafarer/:id/documents" element={<StubPage kind="documents" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
