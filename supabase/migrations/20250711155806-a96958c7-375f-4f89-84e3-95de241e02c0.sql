-- Create table for community memes
CREATE TABLE public.community_memes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  nickname TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_memes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view memes
CREATE POLICY "Anyone can view community memes"
ON public.community_memes
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert memes
CREATE POLICY "Anyone can insert community memes"
ON public.community_memes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create storage bucket for meme images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community-memes', 'community-memes', true);

-- Allow anyone to upload meme images
CREATE POLICY "Anyone can upload meme images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'community-memes');

-- Allow anyone to view meme images
CREATE POLICY "Anyone can view meme images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'community-memes');