import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
    const scannerId = "barcode-scanner";
    const html5Qr = new Html5Qrcode(scannerId);
    html5QrRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 100 },
          formatsToSupport: [0], // CODE_128
        },
        (decodedText) => {
          html5Qr.stop().then(() => {
            onDetected(decodedText);
          });
        },
        () => {} // ignore errors during scanning
      )
      .catch((err) => {
        console.error("Scanner start error:", err);
      });

    return () => {
      html5Qr.stop().catch(() => {});
    };
  }, [onDetected]);

  return <div id="barcode-scanner" className="scanner-container" />;
}
