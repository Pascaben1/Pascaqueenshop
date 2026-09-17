import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

// Logs a lightweight page-view row to Supabase on every route change.
// This feeds the admin's real-time analytics dashboard. It fails silently
// so it never breaks the shopping experience for a visitor.
export default function NavigationTracker() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname === '' ? '/' : location.pathname;

    supabase
      .from('page_views')
      .insert({ path: pathname })
      .then(({ error }) => {
        if (error) {
          // Table may not exist yet if Supabase hasn't been set up, or RLS
          // may be blocking anonymous inserts — either way, ignore quietly.
        }
      });
  }, [location]);

  return null;
}
