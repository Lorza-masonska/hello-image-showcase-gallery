import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Copy, RefreshCw, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TempMail = () => {
  const [customName, setCustomName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showEmailInterface, setShowEmailInterface] = useState(false);
  const [emails, setEmails] = useState([]);
  const [tempEmailId, setTempEmailId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showEmailInterface && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEmailExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showEmailInterface, timeLeft]);

  // Fetch emails when email interface is shown
  useEffect(() => {
    if (showEmailInterface && tempEmailId) {
      fetchEmails();
    }
  }, [showEmailInterface, tempEmailId]);

  // Polling for new emails
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (tempEmailId && showEmailInterface) {
      pollInterval = setInterval(async () => {
        await fetchEmails();
      }, 5000); // Check for new emails every 5 seconds
    }
    return () => clearInterval(pollInterval);
  }, [tempEmailId, showEmailInterface]);

  const handleEmailExpired = async () => {
    if (tempEmailId) {
      // Clean up expired email from database
      await supabase
        .from('temp_emails')
        .delete()
        .eq('id', tempEmailId);
    }
    
    setShowEmailInterface(false);
    setCurrentEmail('');
    setTempEmailId(null);
    toast({
      title: "Mail wygasł",
      description: "Twój tymczasowy mail został usunięty",
      variant: "destructive"
    });
  };

  const fetchEmails = async () => {
    if (!tempEmailId) return;

    const { data, error } = await supabase
      .from('temp_email_messages')
      .select('*')
      .eq('temp_email_id', tempEmailId)
      .order('received_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return;
    }

    setEmails(data || []);
  };

  const generateEmail = async () => {
    if (!customName.trim()) {
      toast({
        title: "Błąd",
        description: "Wpisz nazwę dla swojego maila",
        variant: "destructive"
      });
      return;
    }

    const email = `${customName.trim()}@lorza.pl`;
    
    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('temp_emails')
      .select('id')
      .eq('email_address', email)
      .eq('is_active', true)
      .maybeSingle();

    if (existingEmail) {
      toast({
        title: "Błąd",
        description: "Ten adres email jest już w użyciu",
        variant: "destructive"
      });
      return;
    }

    // Create new temp email
    const { data, error } = await supabase
      .from('temp_emails')
      .insert([{
        email_address: email,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating temp email:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się utworzyć tymczasowego maila",
        variant: "destructive"
      });
      return;
    }

    setCurrentEmail(email);
    setTempEmailId(data.id);
    setTimeLeft(600);
    setShowEmailInterface(true);
    setEmails([]);
    
    toast({
      title: "Mail wygenerowany",
      description: `Twój tymczasowy mail: ${email}`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentEmail);
    toast({
      title: "Skopiowano",
      description: "Adres email został skopiowany do schowka",
    });
  };

  const generateNewMail = async () => {
    // Clean up current email
    if (tempEmailId) {
      await supabase
        .from('temp_emails')
        .delete()
        .eq('id', tempEmailId);
    }

    setShowEmailInterface(false);
    setCurrentEmail('');
    setCustomName('');
    setTimeLeft(600);
    setTempEmailId(null);
    setEmails([]);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-center mb-8">10 Minute Mail</h1>
          
          {!showEmailInterface ? (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-xl mb-4">Wygeneruj swój tymczasowy email</h2>
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Wpisz nazwę (np. test)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">@lorza.pl</span>
                </div>
              </div>
              <Button onClick={generateEmail} className="px-8 py-2">
                Wygeneruj Email
              </Button>
            </div>
          ) : (
            <div>
              {/* Email Info Section */}
              <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold">{currentEmail}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Skopiuj do schowka
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    Czas pozostały: <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={generateNewMail}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Wygeneruj nowy mail
                </Button>
              </div>

              {/* Inbox Section */}
              <div className="border rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold">Skrzynka odbiorcza</h3>
                </div>
                
                <div className="p-4">
                  {emails.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Brak nowych wiadomości</p>
                      <p className="text-sm">Wiadomości będą się pojawiać automatycznie</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {emails.map((email: any, index) => (
                        <div key={index} className="border rounded p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold">{email.sender_name || email.sender_email}</span>
                            <span className="text-sm text-gray-500">{formatDate(email.received_at)}</span>
                          </div>
                          <div className="text-sm font-medium mb-1">{email.subject}</div>
                          <div className="text-sm text-gray-600">
                            {email.body_text ? email.body_text.substring(0, 100) + '...' : 'Brak treści'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempMail;