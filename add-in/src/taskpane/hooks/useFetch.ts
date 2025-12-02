import { useEffect, useState } from "react";

interface Props<T> {
  fetchFn: () => Promise<T>;
}

interface Return<T> {
  data: NonNullable<T> | null;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export const useFetch = <TData>({ fetchFn }: Props<NonNullable<TData>>): Return<TData> => {
  const [data, setData] = useState<NonNullable<TData> | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading) return;

    setIsLoading(true);
    setIsError(false);

    fetchFn()
      .then((res) => setData(res))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [isLoading]);

  const refetch = () => setIsLoading(true);

  return { data, isError, isLoading, refetch };
};
