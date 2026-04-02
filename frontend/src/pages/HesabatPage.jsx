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
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteSayim(id);
      setItems(items.filter((item) => item.id !== id));
    } catch {
      console.error("Delete error");
    }
  };

  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    item.barcode.includes(search)
  );

  if (loading) return <div className="loading"><div className="spinner" />Yüklənir...</div>;

  return (
    <div className="hesabat-page">
      <h2>Hesabat</h2>
      <input
        className="search-field"
        type="text"
        placeholder="Barkod axtar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="export-btn"
        onClick={() => {
          const BOM = "\uFEFF";
          const header = "Barkod,Miqdar,Tarix\n";
          const rows = filtered
            .map((item) => {
              const date = new Date(item.created_at).toLocaleString("az-AZ");
              return `${item.barcode},${item.quantity},${date}`;
            })
            .join("\n");
          const blob = new Blob([BOM + header + rows], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sayim_${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        disabled={filtered.length === 0}
      >
        CSV Export
      </button>
      {filtered.length === 0 ? (
        <p className="empty">{items.length === 0 ? "Hələ heç bir sayım yoxdur." : "Nəticə tapılmadı."}</p>
      ) : (
        <>
          <div className="hesabat-list">
            {filtered.map((item) => (
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
          <div className="total">Cəmi: {filtered.length} əməliyyat</div>
        </>
      )}
    </div>
  );
}
