import { jwtDecode } from './jwtDecode';

/** Check if a JWT token is expired. */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

/** Format ISO date → "Jun 28, 2026" */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** Format ISO datetime → "Jun 28, 2026, 03:30 PM" */
export const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Get initials from name: "John Doe" → "JD" */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
