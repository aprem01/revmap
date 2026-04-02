import { useState, useEffect } from 'react';
import { supabase } from '@/lib/utils/supabase';
import type { Org } from '@/types';

export function useOrg() {
  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrg() {
      // For now, fetch the first org (single-tenant MVP)
      // TODO: resolve org from auth user's org_id
      const { data, error } = await supabase
        .from('orgs')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setOrg(data as Org);
      }
      setLoading(false);
    }

    fetchOrg();
  }, []);

  return { org, loading };
}
