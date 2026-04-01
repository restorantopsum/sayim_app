const API_URL = import.meta.env.VITE_API_URL || "";

export async function saveSayim(barcode, quantity) {
  const res = await fetch(`${API_URL}/api/sayim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ barcode, quantity: Number(quantity) }),
  });
  return res.json();
}

export async function getSayimlar() {
  const res = await fetch(`${API_URL}/api/sayim`);
  return res.json();
}

export async function deleteSayim(id) {
  const res = await fetch(`${API_URL}/api/sayim/${id}`, { method: "DELETE" });
  return res.json();
}
