import { useSWR } from "swr";

export async function fetchJson(input, init) {
  
  const response = await fetch(input, init);


  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new FetchError({
    message: response.statusText,
    response,
    data,
  });
}

export class FetchError extends Error {
  response;
  data;
  constructor({ message, response, data }) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message: message };
  }
}

export function useFetchJson(input, options = {}) {
  const shouldFetch = !!input;
  const { data, error } = useSWR(shouldFetch ? input : null, fetchJson, {
    refreshInterval: options.refreshInterval || 0,
    ...options, 
  });

  return {
    data,
    error,
    isLoading: shouldFetch && !data && !error,
  };
}