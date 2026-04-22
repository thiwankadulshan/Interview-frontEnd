import { showSuccessToast, showErrorToast, showCustomToast } from './toast_utils';

const alert = {
  success: (message: string) => showSuccessToast(message),
  error: (message: string) => showErrorToast(message),
  warn: (message: string) => showCustomToast(message, { backgroundColor: '#f59e0b' }), // Amber 500
};

export default alert;
