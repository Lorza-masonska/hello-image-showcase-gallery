
class CommitHashService {
  private cache: {
    hash: string | null;
    timestamp: number;
  } = {
    hash: null,
    timestamp: 0
  };

  private readonly CACHE_DURATION = 30 * 1000; // Zmniejszmy do 30 sekund dla testów
  private readonly REPO_URL = 'https://api.github.com/repos/Lorza-masonska/Zdjecia/commits';

  async getLatestCommitHash(): Promise<string> {
    const now = Date.now();
    
    console.log('=== COMMIT HASH SERVICE ===');
    console.log('Current time:', new Date(now).toISOString());
    console.log('Cache timestamp:', new Date(this.cache.timestamp).toISOString());
    console.log('Cache age (ms):', now - this.cache.timestamp);
    console.log('Cache duration (ms):', this.CACHE_DURATION);
    console.log('Cached hash:', this.cache.hash);
    
    // Sprawdź czy mamy świeże dane w cache
    if (this.cache.hash && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      console.log('Using cached hash:', this.cache.hash);
      return this.cache.hash;
    }

    try {
      console.log('Fetching latest commit hash from GitHub...');
      const url = `${this.REPO_URL}?per_page=1&t=${now}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 403) {
        const errorData = await response.json();
        console.log('Rate limit error:', errorData);
        if (errorData.message.includes('rate limit')) {
          console.log('GitHub API rate limit reached for commit hash');
          return this.cache.hash || 'rate-limited';
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const commits = await response.json();
      console.log('Received commits:', commits);
      
      if (commits && commits.length > 0) {
        const fullHash = commits[0].sha;
        const shortHash = fullHash.substring(0, 7);
        const commitDate = commits[0].commit.author.date;
        
        console.log('Full hash:', fullHash);
        console.log('Short hash:', shortHash);
        console.log('Commit date:', commitDate);
        console.log('Commit message:', commits[0].commit.message);
        
        // Zaktualizuj cache
        this.cache = {
          hash: shortHash,
          timestamp: now
        };
        
        console.log('Updated cache with new hash:', shortHash);
        return shortHash;
      } else {
        console.log('No commits found');
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
    console.log('Force refreshing commit hash...');
    this.cache.hash = null;
    this.cache.timestamp = 0;
    return this.getLatestCommitHash();
  }

  // Dodaj metodę do sprawdzenia statusu cache
  getCacheStatus() {
    return {
      hash: this.cache.hash,
      timestamp: this.cache.timestamp,
      age: Date.now() - this.cache.timestamp,
      cacheDuration: this.CACHE_DURATION
    };
  }
}

export const commitHashService = new CommitHashService();
