
import { useState, useEffect } from 'react';
import { commitHashService } from '@/services/commitHashService';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        const hash = await commitHashService.getLatestCommitHash();
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
    
    // Sprawdzaj co 3 minuty
    const interval = setInterval(() => {
      fetchCommitHash();
    }, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { commitHash, loading };
};
