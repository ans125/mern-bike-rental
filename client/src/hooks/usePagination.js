import { useMemo, useState } from "react";

// Splits a list into pages; jumps back to page 1 whenever the list itself changes (e.g. a filter).
// Pass a memoized list (useMemo / state), otherwise every render counts as a new list.
const usePagination = (items, pageSize = 10) => {
  const [page, setPage] = useState(1);
  const [prevItems, setPrevItems] = useState(items);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  if (prevItems !== items) {
    setPrevItems(items);
    setPage(1);
  }

  const current = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize]
  );

  return {
    page: current,
    setPage,
    totalPages,
    pageItems,
    from: items.length ? (current - 1) * pageSize + 1 : 0,
    to: Math.min(current * pageSize, items.length),
    total: items.length,
  };
};

export default usePagination;
