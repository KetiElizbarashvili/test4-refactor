import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`/api/items/${id}`, { signal })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(data => setItem(data))
      .catch(() => navigate('/'));

    return () => { controller.abort(); };
  }, [id, navigate]);

  if (!item) return <p role="status">Loading item…</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}
 