'use client';

import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      icon: <CheckCircleIcon className="h-5 w-5 text-accent-green" />,
    }),

  error: (message: string) =>
    toast.error(message, {
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
    }),

  info: (message: string) =>
    toast(message, {
      icon: <InformationCircleIcon className="h-5 w-5 text-primary-blue" />,
    }),

  warning: (message: string) =>
    toast(message, {
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-accent-orange" />,
    }),

  loading: (message: string) => toast.loading(message),

  dismiss: (id?: string) => {
    if (id) toast.dismiss(id);
    else toast.dismiss();
  },
};

export default showToast;
