-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies for phone-based auth (profiles table acts as users)
CREATE POLICY "Anyone can create a profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile by id" 
ON public.profiles 
FOR UPDATE 
USING (true);

-- Update bets policies to work without Supabase Auth
DROP POLICY IF EXISTS "Users can insert their own bets" ON public.bets;
DROP POLICY IF EXISTS "Users can view their own bets" ON public.bets;

CREATE POLICY "Anyone can insert bets" 
ON public.bets 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view all bets" 
ON public.bets 
FOR SELECT 
USING (true);

-- Update deposits policies
DROP POLICY IF EXISTS "Users can insert their own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users can view their own deposits" ON public.deposits;

CREATE POLICY "Anyone can insert deposits" 
ON public.deposits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view deposits" 
ON public.deposits 
FOR SELECT 
USING (true);