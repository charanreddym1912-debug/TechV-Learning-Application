/**
 * Lightweight JWT decoder — payload only, no verification.
 */
export interface JwtPayload {
  sub?: string;
  role?: string;
  userId?: number;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const jwtDecode = (token: string): JwtPayload => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Invalid JWT token');
  }
};
