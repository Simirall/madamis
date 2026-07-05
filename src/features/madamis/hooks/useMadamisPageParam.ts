import { useCallback, useState } from "react";

const readPageParam = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  const page = Number.parseInt(
    new URLSearchParams(window.location.search).get("page") ?? "1",
    10,
  );

  return Number.isNaN(page) || page < 1 ? 1 : page;
};

const replacePageParam = (nextPage: number) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page", String(nextPage));
  window.history.replaceState(null, "", `?${params.toString()}`);
};

export const getCurrentMadamisPage = readPageParam;

export const useMadamisPageParam = () => {
  const [page, setPageState] = useState(readPageParam);

  const setPage = useCallback((nextPage: number) => {
    replacePageParam(nextPage);
    setPageState(nextPage);
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  return { page, resetPage, setPage };
};
