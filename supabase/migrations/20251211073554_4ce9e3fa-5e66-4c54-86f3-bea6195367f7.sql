-- Create a function to get prize statistics (public access)
CREATE OR REPLACE FUNCTION public.get_prize_statistics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_prize', COALESCE(SUM(amount), 0),
    'total_bettors', COUNT(DISTINCT user_id),
    'bets_by_team', COALESCE(
      (SELECT json_agg(team_stats ORDER BY total_amount DESC)
       FROM (
         SELECT 
           team_name as "teamName",
           team_flag as "teamFlag",
           COUNT(DISTINCT user_id) as bettors,
           SUM(amount) as total_amount
         FROM bets
         WHERE status = 'pending'
         GROUP BY team_name, team_flag
       ) team_stats),
      '[]'::json
    )
  ) INTO result
  FROM bets
  WHERE status = 'pending';
  
  RETURN result;
END;
$$;

-- Enable realtime for bets table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bets;