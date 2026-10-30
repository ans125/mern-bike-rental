import { Pagination } from "react-bootstrap";

// "Showing 11–20 of 95" + page buttons with ellipses; pass the object returned by usePagination
const TablePagination = ({ pagination, label = "records" }) => {
  const { page, setPage, totalPages, from, to, total } = pagination;
  if (total === 0) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
      <span className="small text-muted">
        Showing {from}–{to} of {total} {label}
      </span>
      {totalPages > 1 && (
        <Pagination size="sm" className="mb-0">
          <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
          {pages.map((p, i) =>
            p === "…" ? (
              <Pagination.Ellipsis key={`e${i}`} disabled />
            ) : (
              <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                {p}
              </Pagination.Item>
            )
          )}
          <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}
    </div>
  );
};

export default TablePagination;
