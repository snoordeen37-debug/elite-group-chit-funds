const TOKEN_STORAGE_KEY = 'eg_admin_session_token';
const AUTH_STATE_EVENT = 'eg_admin_auth_changed';

export interface AdminAuthResult {
  success: boolean;
  token?: string;
  role?: string;
  error?: string;
}

/**
 * Checks if a session token currently exists in storage
 */
export function getStoredAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Stores the session token
 */
export function setStoredAdminToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: { authenticated: true } }));
  } catch (e) {
    console.error('Failed to store token:', e);
  }
}

/**
 * Removes the session token
 */
export function clearStoredAdminToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: { authenticated: false } }));
  } catch (e) {
    console.error('Failed to clear token:', e);
  }
}

/**
 * Authenticates admin credentials with backend
 */
export async function loginAdmin(password: string): Promise<AdminAuthResult> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setStoredAdminToken(data.token);
      return { success: true, token: data.token, role: data.role };
    }
    return {
      success: false,
      error: data.error || 'Incorrect password. Please try again.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network connection error. Please try again.',
    };
  }
}

/**
 * Validates the stored admin session token with backend (e.g. on page load / refresh)
 */
export async function verifyAdminSession(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) return true;
    }
  } catch (e) {
    console.warn('Session verification fallback to stored token:', e);
    // If offline, trust stored token if valid format
    return token.startsWith('eg_admin_');
  }

  clearStoredAdminToken();
  return false;
}

/**
 * Terminates the admin session
 */
export async function logoutAdmin(): Promise<void> {
  const token = getStoredAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch (e) {
      console.warn('Logout network error:', e);
    }
  }
  clearStoredAdminToken();
}
