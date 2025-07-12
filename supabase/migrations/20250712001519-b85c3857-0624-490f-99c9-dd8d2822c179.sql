-- Allow anyone to delete community memes (for admin purposes)
CREATE POLICY "Anyone can delete community memes" 
ON public.community_memes 
FOR DELETE 
USING (true);