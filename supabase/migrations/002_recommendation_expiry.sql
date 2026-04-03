-- Auto-expire pending recommendations past their expiry date
-- Run this as a cron job or pg_cron scheduled task

create or replace function expire_stale_recommendations()
returns integer as $$
declare
  expired_count integer;
begin
  update recommendations
  set status = 'expired'
  where status = 'pending'
    and expires_at < now();

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$ language plpgsql;

-- Create index to speed up expiry queries
create index if not exists idx_recommendations_expiry
  on recommendations(expires_at)
  where status = 'pending';

-- Optional: enable pg_cron to auto-expire hourly
-- select cron.schedule('expire-recommendations', '0 * * * *', 'select expire_stale_recommendations()');
