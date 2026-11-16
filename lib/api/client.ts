export class ApiError extends Error {
  code: string;
  detail: string;
  
  constructor(code: string, detail: string) {
    super(detail);
    this.code = code;
    this.detail = detail;
  }
}

export async function fetchProxy(endpoint: string, options: RequestInit = {}) {
  const url = `/api/proxy${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    let errorData = null;
    try {
      errorData = await res.json();
    } catch (e) {
      // Not JSON
    }
    
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError('unauthorized', 'Session expired');
    }

    if (res.status === 403 && errorData?.code === 'password_change_required') {
      if (typeof window !== 'undefined') {
        window.location.href = '/change-password';
      }
      throw new ApiError('password_change_required', 'You must change your password before continuing.');
    }

    if (errorData && errorData.code) {
      throw new ApiError(errorData.code, errorData.detail || 'API Error');
    }
    
    throw new ApiError('unknown_error', `API Error: ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  return res.json();
}
