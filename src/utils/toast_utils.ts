import toast from 'react-hot-toast';

interface ToastOptions {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  fontSize?: string;
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    duration: options?.duration || 4000,
    style: {
      color: options?.color || '#fff',
      backgroundColor: options?.backgroundColor || '#10b981',
      fontSize: options?.fontSize || '16px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    duration: options?.duration || 4000,
    style: {
      color: options?.color || '#fff',
      backgroundColor: options?.backgroundColor || '#ef4444',
      fontSize: options?.fontSize || '16px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};

export const showCustomToast = (message: string, options: ToastOptions) => {
  toast(message, {
    duration: options.duration || 3000,
    style: {
      color: options.color || '#fff',
      backgroundColor: options.backgroundColor || '#6366f1',
      fontSize: options.fontSize || '16px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};
