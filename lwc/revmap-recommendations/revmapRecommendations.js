import { LightningElement, track } from 'lwc';

// RevMap Supabase endpoint — configure in Custom Metadata or Named Credential
const REVMAP_API_BASE = ''; // Set via org config

export default class RevmapRecommendations extends LightningElement {
  @track recommendations = [];
  @track isLoading = true;
  @track error = null;

  get hasRecommendations() {
    return this.recommendations.length > 0;
  }

  async connectedCallback() {
    await this.loadRecommendations();
  }

  async loadRecommendations() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(`${REVMAP_API_BASE}/functions/v1/run-recommendations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.recommendations = (data.recommendations ?? []).map(rec => ({
        ...rec,
        isPending: rec.status === 'pending',
        statusLabel: rec.status.charAt(0).toUpperCase() + rec.status.slice(1),
        accountName: rec.account_name ?? 'Unknown Account',
        confidenceScore: Math.round(rec.confidence_score),
      }));
    } catch (err) {
      this.error = `Failed to load recommendations: ${err.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  async handleApprove(event) {
    const recId = event.target.dataset.id;
    try {
      await fetch(`${REVMAP_API_BASE}/functions/v1/approve-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation_id: recId, acted_by: 'sf_user' }),
      });
      await this.loadRecommendations();
    } catch (err) {
      this.error = `Approve failed: ${err.message}`;
    }
  }

  async handleDismiss(event) {
    const recId = event.target.dataset.id;
    try {
      await fetch(`${REVMAP_API_BASE}/functions/v1/approve-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation_id: recId, acted_by: 'sf_user', action: 'dismiss' }),
      });
      await this.loadRecommendations();
    } catch (err) {
      this.error = `Dismiss failed: ${err.message}`;
    }
  }
}
