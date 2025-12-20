type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiUtils = {
  get: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }),
};
