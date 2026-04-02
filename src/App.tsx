import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/shared/sidebar';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { RecommendationsPage } from '@/components/recommendations/recommendations-page';
import { AccountsPage } from '@/components/accounts/accounts-page';
import { RepsPage } from '@/components/reps/reps-page';
import { TerritoriesPage } from '@/components/territories/territories-page';
import { ScenariosPage } from '@/components/scenarios/scenarios-page';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/reps" element={<RepsPage />} />
            <Route path="/territories" element={<TerritoriesPage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
