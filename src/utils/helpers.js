import { format, parseISO } from 'date-fns';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '../config/constants';

/**
 * Format date to display format
 */
export const formatDate = (date, formatStr = DATE_FORMAT) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Format datetime to display format
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * Format time to display format
 */
export const formatTime = (date) => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format phone number with country code
 */
export const formatPhoneNumber = (countryCode, phoneNumber) => {
  if (!phoneNumber) return '';
  const ph = String(phoneNumber).trim();
  const cc = String(countryCode || '').trim();
  if (!cc) return ph;

  // If phone already contains the country code (with or without +), don't duplicate
  const phNoSpaces = ph.replace(/\s+/g, '');
  const ccNormalized = cc.replace(/\s+/g, '');
  const ccNoPlus = ccNormalized.replace(/^\+/, '');

  if (
    phNoSpaces.startsWith(ccNormalized) ||
    phNoSpaces.startsWith('+' + ccNoPlus) ||
    phNoSpaces.startsWith(ccNoPlus)
  ) {
    return ph;
  }

  return `${cc} ${ph}`.trim();
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Convert bytes to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download file from blob
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Parse CSV file
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      resolve(rows);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Generate random color
 */
export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  const regex = /^\d{10,15}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Sort array by key
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Get query params from URL
 */
export const getQueryParams = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get error message from API response
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred'
  );
};

/**
 * Scroll to top
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Check if user has permission
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the permissions
 */
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all permissions
 */
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};
