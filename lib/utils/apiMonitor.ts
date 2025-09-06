// API monitoring utility to track frequent calls
export class ApiMonitor {
  private static calls: Map<string, { count: number; lastCall: number; timestamps: number[] }> = new Map();
  private static logInterval: NodeJS.Timeout | null = null;
  
  static logCall(endpoint: string, method: string = 'GET') {
    const key = `${method} ${endpoint}`;
    const now = Date.now();
    
    if (!this.calls.has(key)) {
      this.calls.set(key, { count: 0, lastCall: now, timestamps: [] });
    }
    
    const callData = this.calls.get(key)!;
    callData.count++;
    callData.lastCall = now;
    callData.timestamps.push(now);
    
    // Keep only last 100 timestamps
    if (callData.timestamps.length > 100) {
      callData.timestamps = callData.timestamps.slice(-100);
    }
    
    // Log frequent calls (more than 10 in last 30 seconds)
    const recentCalls = callData.timestamps.filter(ts => now - ts < 30000);
    if (recentCalls.length > 10) {
      console.warn(`🚨 Frequent API calls detected: ${key} called ${recentCalls.length} times in last 30 seconds`);
    }
    
    // Start periodic reporting if not already running
    if (!this.logInterval) {
      this.startReporting();
    }
  }
  
  static startReporting() {
    this.logInterval = setInterval(() => {
      this.printSummary();
    }, 10000); // Every 10 seconds
  }
  
  static stopReporting() {
    if (this.logInterval) {
      clearInterval(this.logInterval);
      this.logInterval = null;
    }
  }
  
  static printSummary() {
    if (this.calls.size === 0) return;
    
    console.group('📊 API Call Summary (last 10 seconds)');
    
    const now = Date.now();
    let hasRecentCalls = false;
    
    this.calls.forEach((data, endpoint) => {
      const recentCalls = data.timestamps.filter(ts => now - ts < 10000);
      if (recentCalls.length > 0) {
        console.log(`${endpoint}: ${recentCalls.length} calls (total: ${data.count})`);
        hasRecentCalls = true;
      }
    });
    
    if (!hasRecentCalls) {
      console.log('No recent API calls');
    }
    
    console.groupEnd();
  }
  
  static getStats() {
    const stats: Array<{ endpoint: string; total: number; recent: number }> = [];
    const now = Date.now();
    
    this.calls.forEach((data, endpoint) => {
      const recent = data.timestamps.filter(ts => now - ts < 60000).length;
      stats.push({
        endpoint,
        total: data.count,
        recent
      });
    });
    
    return stats.sort((a, b) => b.recent - a.recent);
  }
  
  static reset() {
    this.calls.clear();
    this.stopReporting();
  }
}

// Monkey patch fetch to monitor API calls
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    let url = 'unknown';
    
    if (typeof args[0] === 'string') {
      url = args[0];
    } else if (args[0] instanceof Request) {
      url = args[0].url;
    } else if (args[0] instanceof URL) {
      url = args[0].toString();
    }
    
    const method = args[1]?.method || 'GET';
    
    // Only monitor our API calls
    if (url.includes('localhost:5229') || url.includes('/api/')) {
      ApiMonitor.logCall(url, method);
    }
    
    return originalFetch.apply(this, args);
  };
  
  // Expose to global for debugging
  (window as any).ApiMonitor = ApiMonitor;
}
