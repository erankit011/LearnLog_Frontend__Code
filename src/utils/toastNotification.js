import { toast } from 'react-toastify';

const toastConfig = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    ...toastConfig,
    ...options,
  });
};

export const showError = (message, options = {}) => {
  toast.error(message, {
    ...toastConfig,
    autoClose: 4000,
    ...options,
  });
};

export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    ...toastConfig,
    autoClose: 3500,
    ...options,
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
};
