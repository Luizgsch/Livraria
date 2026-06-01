import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Toast() {
  const { toasts, removeToast } = useEcommerce();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast pointer-events-auto cursor-pointer flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium whitespace-nowrap`}
          style={{
            backgroundColor:
              toast.type === 'success' ? '#2d6a4f' :
              toast.type === 'error' ? '#c1121f' :
              '#fca311',
            color: 'white',
            animation: 'slideIn 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-base">
            {toast.type === 'success' ? '✓' :
             toast.type === 'error' ? '✗' :
             '⚠'}
          </span>
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
