"use client";

import useSWR from 'swr';

// Fetch function to be used by SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export function useData(endpoint) {
  const { data, error } = useSWR(endpoint, fetcher);

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  };
}
