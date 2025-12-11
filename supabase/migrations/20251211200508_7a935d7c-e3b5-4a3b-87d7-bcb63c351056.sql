-- Update the prize statistics function to start with R$6500 base prize
CREATE OR REPLACE FUNCTION public.get_prize_statistics()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
  base_prize CONSTANT INTEGER := 6500;
BEGIN
  SELECT json_build_object(
    'total_prize', base_prize + (COALESCE(SUM(amount), 0) * 20),
    'total_bettors', COUNT(DISTINCT user_id),
    'bets_by_team', COALESCE(
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
    )
  ) INTO result
  FROM bets
  WHERE status = 'pending';
  
  RETURN result;
END;
$function$;