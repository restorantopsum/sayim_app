import { useState, useEffect } from "react";
import { getSayimlar, deleteSayim } from "../api";

export default function HesabatPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getSayimlar();
      setItems(data);
    } catch {
      console.error("Fetch error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSayim(id);
      setItems(items.filter((item) => item.id !== id));
    } catch {
      console.error("Delete error");
    }
  };

  if (loading) return <div className="loading">Yüklənir...</div>;

  return (
    <div className="hesabat-page">
      <h2>Hesabat</h2>
      {items.length === 0 ? (
        <p className="empty">Hələ heç bir sayım yoxdur.</p>
      ) : (
        <>
          <div className="hesabat-list">
            {items.map((item) => (
              <div key={item.id} className="hesabat-row">
                <span className="h-barcode">{item.barcode}</span>
                <span className="h-qty">{item.quantity}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
          <div className="total">Cəmi: {items.length} əməliyyat</div>
        </>
      )}
    </div>
  );
}
