-- Update the prize statistics function with base R$6500 and simulated bettors/teams
CREATE OR REPLACE FUNCTION public.get_prize_statistics()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
  base_prize CONSTANT INTEGER := 6500;
  base_bettors CONSTANT INTEGER := 12;
  real_total_prize INTEGER;
  real_total_bettors INTEGER;
  real_bets_by_team JSON;
  base_teams JSON := '[
    {"teamName": "Brasil", "teamFlag": "🇧🇷", "bettors": 4, "total_amount": 2400},
    {"teamName": "Argentina", "teamFlag": "🇦🇷", "bettors": 3, "total_amount": 1800},
    {"teamName": "França", "teamFlag": "🇫🇷", "bettors": 2, "total_amount": 1200},
    {"teamName": "Alemanha", "teamFlag": "🇩🇪", "bettors": 2, "total_amount": 700},
    {"teamName": "Espanha", "teamFlag": "🇪🇸", "bettors": 1, "total_amount": 400}
  ]'::json;
BEGIN
  -- Get real data from bets
  SELECT 
    COALESCE(SUM(amount) * 20, 0),
    COUNT(DISTINCT user_id)
  INTO real_total_prize, real_total_bettors
  FROM bets
  WHERE status = 'pending';
  
  -- Get real bets by team
  SELECT COALESCE(
    (SELECT json_agg(team_stats ORDER BY total_amount DESC)
     FROM (
       SELECT 
         team_name as "teamName",
         team_flag as "teamFlag",
         COUNT(DISTINCT user_id) as bettors,
         SUM(amount) * 20 as total_amount
       FROM bets
       WHERE status = 'pending'
       GROUP BY team_name, team_flag
     ) team_stats),
    '[]'::json
  ) INTO real_bets_by_team;
  
  -- If there are no real bets, return base data
  IF real_total_bettors = 0 THEN
    SELECT json_build_object(
      'total_prize', base_prize,
      'total_bettors', base_bettors,
      'bets_by_team', base_teams
    ) INTO result;
  ELSE
    -- Combine base + real data
    SELECT json_build_object(
      'total_prize', base_prize + real_total_prize,
      'total_bettors', base_bettors + real_total_bettors,
      'bets_by_team', (
        SELECT json_agg(combined ORDER BY (combined->>'total_amount')::int DESC)
        FROM (
          -- Base teams
          SELECT * FROM json_array_elements(base_teams) as combined
          UNION ALL
          -- Real teams (only those not in base)
          SELECT elem FROM json_array_elements(real_bets_by_team) as elem
          WHERE NOT EXISTS (
            SELECT 1 FROM json_array_elements(base_teams) as base_elem
            WHERE base_elem->>'teamName' = elem->>'teamName'
          )
        ) sub
      )
    ) INTO result;
  END IF;
  
  RETURN result;
END;
$function$;