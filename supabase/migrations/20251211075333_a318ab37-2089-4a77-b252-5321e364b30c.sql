-- Remove foreign key constraints that reference auth.users
ALTER TABLE public.bets DROP CONSTRAINT IF EXISTS bets_user_id_fkey;
ALTER TABLE public.deposits DROP CONSTRAINT IF EXISTS deposits_user_id_fkey;

-- Add new foreign key constraints that reference profiles instead
ALTER TABLE public.bets 
ADD CONSTRAINT bets_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.deposits 
ADD CONSTRAINT deposits_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;