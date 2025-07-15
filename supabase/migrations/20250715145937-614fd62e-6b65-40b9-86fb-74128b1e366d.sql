-- Tabela dla tymczasowych maili
CREATE TABLE public.temp_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Tabela dla otrzymanych wiadomości email
CREATE TABLE public.temp_email_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  temp_email_id UUID NOT NULL REFERENCES public.temp_emails(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT NOT NULL,
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX idx_temp_emails_address ON public.temp_emails(email_address);
CREATE INDEX idx_temp_emails_expires ON public.temp_emails(expires_at);
CREATE INDEX idx_temp_email_messages_temp_email_id ON public.temp_email_messages(temp_email_id);

-- RLS dla temp_emails - wszystkie operacje dozwolone (publiczne API)
ALTER TABLE public.temp_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage temp emails" ON public.temp_emails FOR ALL USING (true) WITH CHECK (true);

-- RLS dla temp_email_messages - wszystkie operacje dozwolone (publiczne API)
ALTER TABLE public.temp_email_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage temp email messages" ON public.temp_email_messages FOR ALL USING (true) WITH CHECK (true);

-- Funkcja do czyszczenia wygasłych maili
CREATE OR REPLACE FUNCTION cleanup_expired_temp_emails()
RETURNS void AS $$
BEGIN
  DELETE FROM public.temp_emails WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;