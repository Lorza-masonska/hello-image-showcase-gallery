
import { useState, useEffect } from 'react';
import { commitHashService } from '@/services/commitHashService';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        console.log('=== useGitCommitHash: Fetching hash ===');
        const hash = await commitHashService.getLatestCommitHash();
        console.log('useGitCommitHash: Received hash:', hash);
        setCommitHash(hash);
      } catch (error) {
        console.error('Error in useGitCommitHash:', error);
        setCommitHash('unknown');
      } finally {
        setLoading(false);
      }
    };

    // Pierwsze pobranie
    fetchCommitHash();
    
    // Sprawdzaj co 30 sekund dla testów (później można zwiększyć)
    const interval = setInterval(() => {
      console.log('=== Interval check ===');
      fetchCommitHash();
    }, 30 * 1000);
    
    return () => {
      console.log('Cleaning up commit hash interval');
      clearInterval(interval);
    };
  }, []);

  return { commitHash, loading };
};
