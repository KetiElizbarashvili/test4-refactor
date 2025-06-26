import React, { useState, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";
import './ItemsPage.css';

const ITEM_HEIGHT = 50;
const LIST_HEIGHT = 600;
const PAGE_SIZE = 20;

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const listRef = useRef();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: query,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
        });
        const res = await fetch(`http://localhost:3001/api/items?${params}`, { signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [query, page]);

  useEffect(() => {
    listRef.current?.scrollToItem(0);
  }, [page, query]);

  const SkeletonRow = ({ index, style }) => (
    <div style={style} key={index} className="skeleton-row" />
  );

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style} key={item.id}>
        <Link to={`/items/${item.id}`} className="item-link">
          {item.name}
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <List
          height={LIST_HEIGHT}
          width="100%"
          itemCount={10}
          itemSize={ITEM_HEIGHT}
        >
          {SkeletonRow}
        </List>
      </div>
    );
  }

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="page-container">
      <div className="search-controls">
        <input
          type="search"
          aria-label="Search items"
          placeholder="Search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          className="search-input"
        />
        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0} className="btn">
          Prev
        </button>
        <button onClick={() => setPage((p) => p + 1)} disabled={items.length < PAGE_SIZE} className="btn">
          Next
        </button>
        <span className="page-number">Page {page + 1}</span>
      </div>
      <List
        ref={listRef}
        height={LIST_HEIGHT}
        width="100%"
        itemCount={items.length}
        itemSize={ITEM_HEIGHT}
      >
        {Row}
      </List>
    </div>
  );
}
 