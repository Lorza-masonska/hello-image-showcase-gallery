-- Wyłącz RLS dla tabeli categories ponieważ kontrola dostępu jest teraz w UI przez localStorage
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;