import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Toast() {
  const { toasts, removeToast } = useEcommerce();

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast pointer-events-auto cursor-pointer`}
          style={{
            backgroundColor:
              toast.type === 'success' ? '#2d6a4f' :
              toast.type === 'error' ? '#c1121f' :
              '#fca311',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            animation: 'slideIn 0.3s ease-out',
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span className="flex items-center gap-2">
            <span>
              {toast.type === 'success' ? '✓' :
               toast.type === 'error' ? '✗' :
               '⚠'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
