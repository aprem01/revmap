import type { Org } from '@/types';

const SF_API_VERSION = 'v59.0';

export class SalesforceClient {
  private instanceUrl: string;
  private accessToken: string;

  constructor(org: Org) {
    if (!org.salesforce_instance_url || !org.salesforce_access_token) {
      throw new Error('Salesforce credentials not configured for this org');
    }
    this.instanceUrl = org.salesforce_instance_url;
    this.accessToken = org.salesforce_access_token;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.instanceUrl}/services/data/${SF_API_VERSION}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Salesforce API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  async query<T>(soql: string): Promise<{ records: T[]; totalSize: number }> {
    return this.request(`/query?q=${encodeURIComponent(soql)}`);
  }

  async fetchAccounts() {
    return this.query<Record<string, unknown>>(
      `SELECT Id, Name, Industry, NumberOfEmployees, AnnualRevenue, Website,
              BillingCity, BillingState, BillingCountry, OwnerId,
              LastActivityDate
       FROM Account
       WHERE IsDeleted = false`
    );
  }

  async fetchOpportunities() {
    return this.query<Record<string, unknown>>(
      `SELECT Id, Name, AccountId, OwnerId, Amount, StageName, IsClosed,
              IsWon, CloseDate, Type
       FROM Opportunity`
    );
  }

  async fetchUsers() {
    return this.query<Record<string, unknown>>(
      `SELECT Id, Name, Email, UserRole.Name, IsActive
       FROM User
       WHERE IsActive = true AND UserType = 'Standard'`
    );
  }

  async updateAccountOwner(accountId: string, newOwnerId: string) {
    return this.request(`/sobjects/Account/${accountId}`, {
      method: 'PATCH',
      body: JSON.stringify({ OwnerId: newOwnerId }),
    });
  }
}
