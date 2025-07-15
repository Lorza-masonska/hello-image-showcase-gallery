-- Najpierw usuń istniejące polityki dla kategorii
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

-- Utworz tabele dla ról użytkowników
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Włącz RLS dla user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Funkcja do sprawdzania czy użytkownik jest adminem
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = $1 AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Nowe polityki RLS dla kategorii
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.is_admin());

-- Polityki RLS dla user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());