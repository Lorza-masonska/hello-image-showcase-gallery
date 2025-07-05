
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
      console.log('=== useGitCommitHash: Fetching hash ===', { forceRefresh });
      const hash = forceRefresh 
        ? await commitHashService.forceRefresh() 
        : await commitHashService.getLatestCommitHash();
      
      console.log('useGitCommitHash: Received hash:', hash);
      setCommitHash(hash);
      
      // Jeśli nadal pokazuje unknown, spróbuj ustawić fallback
      if (hash === 'unknown') {
        console.log('Got unknown hash, setting fallback');
        commitHashService.setManualHash('v1.2.3');
        setCommitHash('v1.2.3');
      }
      
    } catch (error) {
      console.error('Error in useGitCommitHash:', error);
      setError('Błąd pobierania wersji');
      setCommitHash('v1.2.3'); // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pierwsze pobranie
    fetchCommitHash(true);
    
    // Sprawdzaj co 5 minut
    const interval = setInterval(() => {
      console.log('=== Interval check (5min) ===');
      fetchCommitHash(false);
    }, 5 * 60 * 1000);
    
    return () => {
      console.log('Cleaning up commit hash interval');
      clearInterval(interval);
    };
  }, []);

  const forceRefresh = () => {
    console.log('Force refresh requested by user');
    fetchCommitHash(true);
  };

  return { commitHash, loading, error, forceRefresh };
};
