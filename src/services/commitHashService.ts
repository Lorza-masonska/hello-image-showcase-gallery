
class CommitHashService {
  private cache: {
    hash: string | null;
    timestamp: number;
  } = {
    hash: null,
    timestamp: 0
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minut
  private readonly REPO_URL = 'https://api.github.com/repos/Lorza-masonska/Zdjecia/commits';
  private readonly FALLBACK_HASH = 'v1.2.3'; // Fallback version

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

    return this.fetchFromGitHub();
  }

  private async fetchFromGitHub(): Promise<string> {
    try {
      console.log('Attempting to fetch latest commit hash from GitHub...');
      
      // Próba z GitHub API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${this.REPO_URL}?per_page=1&_=${Date.now()}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      console.log('GitHub API Response status:', response.status);
      
      if (response.ok) {
        const commits = await response.json();
        console.log('Successfully fetched commits:', commits.length);
        
        if (commits && commits.length > 0) {
          const fullHash = commits[0].sha;
          const shortHash = fullHash.substring(0, 7);
          
          console.log('New commit hash:', shortHash);
          
          // Zaktualizuj cache
          this.cache = {
            hash: shortHash,
            timestamp: Date.now()
          };
          
          return shortHash;
        }
      } else if (response.status === 403) {
        console.log('GitHub API rate limit or access denied');
        return this.handleFallback('rate-limited');
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      
      if (error.name === 'AbortError') {
        console.log('Request timed out');
        return this.handleFallback('timeout');
      }
      
      // Dla CORS lub innych błędów sieciowych
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        console.log('Network/CORS error detected');
        return this.handleFallback('network-error');
      }
      
      return this.handleFallback('error');
    }
  }

  private handleFallback(reason: string): string {
    console.log('Using fallback hash due to:', reason);
    
    // Jeśli mamy stary hash w cache, użyj go
    if (this.cache.hash && this.cache.hash !== 'unknown') {
      console.log('Returning cached hash:', this.cache.hash);
      this.cache.timestamp = Date.now(); // Przedłuż ważność cache
      return this.cache.hash;
    }
    
    // Inaczej użyj fallback
    console.log('Using fallback hash:', this.FALLBACK_HASH);
    this.cache = {
      hash: this.FALLBACK_HASH,
      timestamp: Date.now()
    };
    
    return this.FALLBACK_HASH;
  }

  // Wymuś odświeżenie
  async forceRefresh(): Promise<string> {
    console.log('Force refreshing commit hash...');
    this.cache.hash = null;
    this.cache.timestamp = 0;
    return this.fetchFromGitHub();
  }

  // Ustaw hash ręcznie (dla testów)
  setManualHash(hash: string): void {
    console.log('Setting manual hash:', hash);
    this.cache = {
      hash: hash,
      timestamp: Date.now()
    };
  }

  // Status cache
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
