
import { useState, useEffect } from 'react';
import { commitHashService } from '@/services/commitHashService';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('ładowanie...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommitHash = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const hash = forceRefresh 
        ? await commitHashService.forceRefresh() 
        : await commitHashService.getLatestCommitHash();
      
      setCommitHash(hash);
      
      if (hash === 'unknown') {
        commitHashService.setManualHash('v1.2.3');
        setCommitHash('v1.2.3');
      }
      
    } catch (error) {
      setError('Błąd pobierania wersji');
      setCommitHash('v1.2.3');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitHash(true);
    
    const interval = setInterval(() => {
      fetchCommitHash(false);
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const forceRefresh = () => {
    fetchCommitHash(true);
  };

  return { commitHash, loading, error, forceRefresh };
};
