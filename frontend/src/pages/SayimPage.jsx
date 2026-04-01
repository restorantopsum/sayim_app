import { useState, useCallback } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import Calculator from "../components/Calculator";
import { saveSayim } from "../api";

export default function SayimPage() {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleDetected = useCallback((code) => {
    setBarcode(code);
    setScanning(false);
    setQuantity("");
    setStatus("");
  }, []);

  const evaluateExpression = (expr) => {
    if (!expr) return 0;
    try {
      const parts = expr.split("+").map(Number);
      return parts.reduce((sum, n) => sum + (isNaN(n) ? 0 : n), 0);
    } catch {
      return 0;
    }
  };

  const handleConfirm = async () => {
    if (!barcode) {
      setStatus("Əvvəlcə barkod oxudun!");
      setStatusType("error");
      return;
    }
    const qty = evaluateExpression(quantity);
    if (qty <= 0) {
      setStatus("Miqdar daxil et!");
      setStatusType("error");
      return;
    }

    try {
      await saveSayim(barcode, qty);
      setStatus("Saxlanıldı ✓");
      setStatusType("success");
      setBarcode("");
      setQuantity("");
      setTimeout(() => setStatus(""), 1500);
    } catch {
      setStatus("Xəta baş verdi!");
      setStatusType("error");
    }
  };

  return (
    <div className="sayim-page">
      {scanning ? (
        <BarcodeScanner onDetected={handleDetected} />
      ) : (
        <button className="scan-btn" onClick={() => {
          setStatus("");
          setScanning(true);
        }}>
          📷 Scan Et
        </button>
      )}

      {barcode && (
        <div className="barcode-display">
          Barkod: <strong>{barcode}</strong>
        </div>
      )}

      <div className="quantity-display">
        <label>Miqdar:</label>
        <div className="quantity-field" readOnly>
          {quantity || "0"}
        </div>
      </div>

      {status && <div className={`status-msg ${statusType}`}>{status}</div>}

      <Calculator
        value={quantity}
        onChange={setQuantity}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
