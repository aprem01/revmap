import { PageHeader } from '@/components/shared/page-header';
import { PipelineView } from './pipeline-view';

export function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="GTM Pipeline"
        description="Unified 5-stage pipeline — Discover → Classify → Score → Assign → Sync"
      />
      <PipelineView />
    </div>
  );
}
