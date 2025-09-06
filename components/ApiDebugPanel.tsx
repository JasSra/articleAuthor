'use client';

import React, { useState, useEffect } from 'react';
import { ApiMonitor } from '@/lib/utils/apiMonitor';

export default function ApiDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<Array<{ endpoint: string; total: number; recent: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(ApiMonitor.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
        >
          🚨 API Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">API Call Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => ApiMonitor.reset()}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {stats.length === 0 ? (
        <p className="text-gray-500 text-sm">No API calls detected</p>
      ) : (
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-2 rounded text-xs ${
                stat.recent > 5 ? 'bg-red-50 border border-red-200' : 
                stat.recent > 2 ? 'bg-yellow-50 border border-yellow-200' : 
                'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="font-mono text-xs mb-1 truncate" title={stat.endpoint}>
                {stat.endpoint.length > 50 ? stat.endpoint.substring(0, 50) + '...' : stat.endpoint}
              </div>
              <div className="flex justify-between">
                <span>Recent (1min): <strong>{stat.recent}</strong></span>
                <span>Total: {stat.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          🟢 Normal (≤2/min) 🟡 Frequent (3-5/min) 🔴 Excessive (5+/min)
        </p>
      </div>
    </div>
  );
}
