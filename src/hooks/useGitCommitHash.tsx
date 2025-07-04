
import { useState, useEffect } from 'react';

export const useGitCommitHash = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        // Pobierz najnowszy commit z domyślnej gałęzi (bez określania konkretnej gałęzi)
        const response = await fetch('https://api.github.com/repos/Lorza-masonska/Zdjecia/commits?per_page=1');
        
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.message.includes('rate limit')) {
            console.log('GitHub API rate limit reached for commit hash');
            setCommitHash('rate-limited');
            setLoading(false);
            return;
          }
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch commit data');
        }
        
        const commits = await response.json();
        if (commits && commits.length > 0) {
          // Skróć hash do 7 znaków (standardowa długość)
          const shortHash = commits[0].sha.substring(0, 7);
          setCommitHash(shortHash);
        } else {
          setCommitHash('no-commits');
        }
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
