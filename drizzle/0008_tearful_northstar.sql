-- These additive columns are initialized idempotently by the course and
-- commerce route handlers because the existing production database may
-- already contain some of them from earlier runtime-safe upgrades.
SELECT 1;
