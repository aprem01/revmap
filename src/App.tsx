import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/landing/landing-page';
import { AppLayout } from '@/components/shared/app-layout';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { PipelinePage } from '@/components/dashboard/pipeline-page';
import { RecommendationsPage } from '@/components/recommendations/recommendations-page';
import { AccountsPage } from '@/components/accounts/accounts-page';
import { AccountDetail } from '@/components/accounts/account-detail';
import { RepsPage } from '@/components/reps/reps-page';
import { RepDetail } from '@/components/reps/rep-detail';
import { TerritoriesPage } from '@/components/territories/territories-page';
import { ScenariosPage } from '@/components/scenarios/scenarios-page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="accounts/:id" element={<AccountDetail />} />
          <Route path="reps" element={<RepsPage />} />
          <Route path="reps/:id" element={<RepDetail />} />
          <Route path="territories" element={<TerritoriesPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
