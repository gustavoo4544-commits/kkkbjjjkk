-- Add indexes for better query performance on high traffic

-- Index for profiles lookup by phone (used in login)
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Index for deposits by user_id (used in history)
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);

-- Index for bets by user_id (used in history)
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON public.bets(user_id);

-- Index for bets by status (used in prize calculation)
CREATE INDEX IF NOT EXISTS idx_bets_status ON public.bets(status);

-- Composite index for bets team aggregation (used in prize stats)
CREATE INDEX IF NOT EXISTS idx_bets_team_status ON public.bets(team_name, status);