import { API_BASE_URL, getAuthHeaders } from '../config/api';

// Generic API call wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// GET request
export const get = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  return apiCall<T>(endpoint, { method: 'GET', ...options });
};

// POST request
export const post = <T>(
  endpoint: string,
  body: any,
  options?: RequestInit
): Promise<T> => {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
};

// PATCH request
export const patch = <T>(
  endpoint: string,
  body: any,
  options?: RequestInit
): Promise<T> => {
  return apiCall<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });
};

// DELETE request
export const del = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  return apiCall<T>(endpoint, { method: 'DELETE', ...options });
};
