import { LightningElement, track, api } from 'lwc';

// Configure via Salesforce Custom Metadata Type or Named Credential
const REVMAP_API_BASE = ''; // Set in org: e.g., https://your-project.supabase.co
const REVMAP_ANON_KEY = ''; // Set in org: Supabase anon key

export default class RevmapRecommendations extends LightningElement {
  @api recordId; // Account record ID from Salesforce page context
  @track recommendations = [];
  @track isLoading = true;
  @track error = null;
  @track successMessage = null;

  get hasRecommendations() {
    return this.recommendations.length > 0;
  }

  get pendingCount() {
    return this.recommendations.filter(r => r.isPending).length;
  }

  async connectedCallback() {
    await this.loadRecommendations();
  }

  async apiCall(path, options = {}) {
    if (!REVMAP_API_BASE) {
      throw new Error('RevMap API not configured. Set REVMAP_API_BASE in component settings.');
    }

    const response = await fetch(`${REVMAP_API_BASE}/functions/v1/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': REVMAP_ANON_KEY,
        'Authorization': `Bearer ${REVMAP_ANON_KEY}`,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API error ${response.status}: ${body}`);
    }

    return response.json();
  }

  async loadRecommendations() {
    this.isLoading = true;
    this.error = null;

    try {
      // Fetch recommendations — optionally filtered by account
      const params = this.recordId ? `?account_crm_id=${this.recordId}` : '';
      const data = await this.apiCall(`run-recommendations${params}`, { method: 'GET' });

      this.recommendations = (data.recommendations ?? []).map(rec => ({
        ...rec,
        isPending: rec.status === 'pending',
        statusLabel: rec.status.charAt(0).toUpperCase() + rec.status.slice(1),
        accountName: rec.account_name ?? 'Unknown Account',
        confidenceScore: Math.round(rec.confidence_score),
        typeLabel: rec.type.replace(/_/g, ' '),
        typeClass: this.getTypeClass(rec.type),
      }));
    } catch (err) {
      this.error = `Failed to load recommendations: ${err.message}`;
      console.error('RevMap LWC error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  getTypeClass(type) {
    const classes = {
      REASSIGN: 'slds-badge slds-badge_inverse',
      RE_ENGAGE: 'slds-badge',
      ADD_TO_TERRITORY: 'slds-badge slds-badge_lightest',
      RETIRE: 'slds-badge slds-badge_inverse',
      REBALANCE: 'slds-badge',
    };
    return classes[type] || 'slds-badge';
  }

  showSuccess(message) {
    this.successMessage = message;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => { this.successMessage = null; }, 3000);
  }

  async handleApprove(event) {
    const recId = event.target.dataset.id;
    this.error = null;

    try {
      await this.apiCall('approve-recommendation', {
        method: 'POST',
        body: JSON.stringify({ recommendation_id: recId, acted_by: 'sf_user' }),
      });
      this.showSuccess('Recommendation approved — changes synced to Salesforce.');
      await this.loadRecommendations();
    } catch (err) {
      this.error = `Approve failed: ${err.message}`;
    }
  }

  async handleDismiss(event) {
    const recId = event.target.dataset.id;
    this.error = null;

    try {
      // Use a separate dismiss endpoint or pass action param
      await this.apiCall('approve-recommendation', {
        method: 'POST',
        body: JSON.stringify({
          recommendation_id: recId,
          acted_by: 'sf_user',
          action: 'dismiss',
        }),
      });
      this.showSuccess('Recommendation dismissed.');
      await this.loadRecommendations();
    } catch (err) {
      this.error = `Dismiss failed: ${err.message}`;
    }
  }

  handleRefresh() {
    this.loadRecommendations();
  }
}
