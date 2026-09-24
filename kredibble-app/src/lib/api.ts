import { Platform } from 'react-native';

export type AuthRole = 'seeker' | 'hirer' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole | string;
  seeker?: unknown;
  hirer?: unknown;
  staff?: unknown;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

const fallbackApiUrl = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  default: 'http://localhost:4000/api',
});

const getApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!envUrl) return fallbackApiUrl || 'http://localhost:4000/api';

  if (envUrl.includes('.') && !envUrl.startsWith('http')) {
    return `https://${envUrl.replace(/\/$/, '')}`;
  }

  return envUrl.replace(/\/$/, '');
};

export const API_BASE_URL = getApiUrl();

const TOKEN_KEY = 'kredibble_app_token';
const USER_KEY = 'kredibble_app_user';

const canUseLocalStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const saveMobileSession = ({ token, user }: AuthResponse) => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getMobileToken = () =>
  canUseLocalStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getMobileToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the Kredibble API at ${API_BASE_URL}. Start the backend with "npm run dev" in kredibble-backend, then try again.`,
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = payload?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return payload.data as T;
}

export const getOpportunities = async () => {
  return request<any[]>('/opportunities');
};

export const getDashboardSummary = async () => {
  return request<any>('/dashboard/summary');
};

export const getMe = async () => {
  return request<AuthUser>('/auth/me');
};

export const loginMobile = async (email: string, password: string) => {
  const session = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveMobileSession(session);
  return session;
};

export const signupMobile = async (values: {
  name: string;
  email: string;
  password: string;
  role: 'seeker' | 'hirer';
  profession?: string;
  university?: string;
  country?: string;
  city?: string;
  companyName?: string;
  industry?: string;
  location?: string;
  website?: string;
  companySize?: string;
  companyEmail?: string;
  phone?: string;
  technicalSkills?: string[];
  recruiterRole?: string;
  recruiterPhone?: string;
  recruiterLinkedin?: string;
}) => {
  const session = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  });
  saveMobileSession(session);
  return session;
};
