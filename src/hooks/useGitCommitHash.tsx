
import { useState, useEffect } from 'react';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        // Pobierz najnowszy commit z głównej gałęzi
        const response = await fetch('https://api.github.com/repos/Lorza-masonska/Zdjecia/commits/main');
        
        if (!response.ok) {
          throw new Error('Failed to fetch commit data');
        }
        
        const commitData = await response.json();
        // Skróć hash do 7 znaków (standardowa długość)
        const shortHash = commitData.sha.substring(0, 7);
        setCommitHash(shortHash);
      } catch (error) {
        console.error('Error fetching commit hash:', error);
        setCommitHash('unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchCommitHash();
  }, []);

  return { commitHash, loading };
};
