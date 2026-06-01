import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Toast() {
  const { toasts, removeToast } = useEcommerce();

  return (
    <div className="fixed bottom-4 right-4 z-9999 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium min-w-max"
          style={{
            backgroundColor:
              toast.type === 'success' ? '#2d6a4f' :
              toast.type === 'error' ? '#c1121f' :
              '#fca311',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span>
            {toast.type === 'success' ? '✓' :
             toast.type === 'error' ? '✗' :
             '⚠'}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
