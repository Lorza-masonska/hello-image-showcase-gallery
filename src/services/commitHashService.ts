
class CommitHashService {
  private cache: {
    hash: string | null;
    timestamp: number;
  } = {
    hash: null,
    timestamp: 0
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000;
  private readonly REPO_URL = 'https://api.github.com/repos/Lorza-masonska/Zdjecia/commits';
  private readonly FALLBACK_HASH = 'v1.2.3';

  async getLatestCommitHash(): Promise<string> {
    const now = Date.now();
    
    if (this.cache.hash && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache.hash;
    }

    return this.fetchFromGitHub();
  }

  private async fetchFromGitHub(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
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
      
      if (response.ok) {
        const commits = await response.json();
        
        if (commits && commits.length > 0) {
          const fullHash = commits[0].sha;
          const shortHash = fullHash.substring(0, 7);
          
          this.cache = {
            hash: shortHash,
            timestamp: Date.now()
          };
          
          return shortHash;
        }
      } else if (response.status === 403) {
        return this.handleFallback('rate-limited');
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        return this.handleFallback('timeout');
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        return this.handleFallback('network-error');
      }
      
      return this.handleFallback('error');
    }
  }

  private handleFallback(reason: string): string {
    if (this.cache.hash && this.cache.hash !== 'unknown') {
      this.cache.timestamp = Date.now();
      return this.cache.hash;
    }
    
    this.cache = {
      hash: this.FALLBACK_HASH,
      timestamp: Date.now()
    };
    
    return this.FALLBACK_HASH;
  }

  async forceRefresh(): Promise<string> {
    this.cache.hash = null;
    this.cache.timestamp = 0;
    return this.fetchFromGitHub();
  }

  setManualHash(hash: string): void {
    this.cache = {
      hash: hash,
      timestamp: Date.now()
    };
  }

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
