import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/** Hook to access AuthContext. Throws if used outside AuthProvider. */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
