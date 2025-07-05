
import { useState, useEffect } from 'react';
import { commitHashService } from '@/services/commitHashService';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');
  const [loading, setLoading] = useState(true);

  const fetchCommitHash = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log('=== useGitCommitHash: Fetching hash ===', { forceRefresh });
      const hash = forceRefresh 
        ? await commitHashService.forceRefresh() 
        : await commitHashService.getLatestCommitHash();
      console.log('useGitCommitHash: Received hash:', hash);
      setCommitHash(hash);
    } catch (error) {
      console.error('Error in useGitCommitHash:', error);
      setCommitHash('unknown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pierwsze pobranie z wymuszeniem odświeżenia
    fetchCommitHash(true);
    
    // Sprawdzaj co 30 sekund dla testów (później można zwiększyć)
    const interval = setInterval(() => {
      console.log('=== Interval check ===');
      fetchCommitHash(false);
    }, 30 * 1000);
    
    return () => {
      console.log('Cleaning up commit hash interval');
      clearInterval(interval);
    };
  }, []);

  const forceRefresh = () => {
    console.log('Force refresh requested by user');
    fetchCommitHash(true);
  };

  return { commitHash, loading, forceRefresh };
};
