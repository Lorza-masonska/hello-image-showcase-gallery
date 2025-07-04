
class CommitHashService {
  private cache: {
    hash: string | null;
    timestamp: number;
  } = {
    hash: null,
    timestamp: 0
  };

  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minuty
  private readonly REPO_URL = 'https://api.github.com/repos/Lorza-masonska/Zdjecia/commits';

  async getLatestCommitHash(): Promise<string> {
    const now = Date.now();
    
    // Sprawdź czy mamy świeże dane w cache
    if (this.cache.hash && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache.hash;
    }

    try {
      console.log('Fetching latest commit hash...');
      const response = await fetch(`${this.REPO_URL}?per_page=1&t=${now}`);
      
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.message.includes('rate limit')) {
          console.log('GitHub API rate limit reached for commit hash');
          // Zwróć ostatni znany hash jeśli mamy
          return this.cache.hash || 'rate-limited';
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const commits = await response.json();
      if (commits && commits.length > 0) {
        const shortHash = commits[0].sha.substring(0, 7);
        
        // Zaktualizuj cache
        this.cache = {
          hash: shortHash,
          timestamp: now
        };
        
        console.log('Latest commit hash:', shortHash);
        return shortHash;
      } else {
        return 'no-commits';
      }
    } catch (error) {
      console.error('Error fetching commit hash:', error);
      
      // Zwróć ostatni znany hash jeśli mamy, inaczej 'unknown'
      return this.cache.hash || 'unknown';
    }
  }

  // Wymuś odświeżenie (ignoruj cache)
  async forceRefresh(): Promise<string> {
    this.cache.hash = null;
    this.cache.timestamp = 0;
    return this.getLatestCommitHash();
  }
}

export const commitHashService = new CommitHashService();
