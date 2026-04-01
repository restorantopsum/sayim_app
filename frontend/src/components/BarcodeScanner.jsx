import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function BarcodeScanner({ onDetected }) {
  const html5QrRef = useRef(null);

  useEffect(() => {
    const scannerId = "barcode-scanner";
    const html5Qr = new Html5Qrcode(scannerId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ],
      verbose: false,
    });
    html5QrRef.current = html5Qr;

    html5Qr
      .start(
        {
          facingMode: "environment",
        },
        {
          fps: 20,
          qrbox: { width: 300, height: 120 },
          videoConstraints: {
            facingMode: "environment",
            advanced: [
              { focusMode: "continuous" },
              { zoom: 2.0 },
            ],
          },
        },
        (decodedText) => {
          html5Qr.stop().then(() => {
            onDetected(decodedText);
          });
        },
        () => {}
      )
      .catch((err) => {
        console.error("Scanner start error:", err);
      });

    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, [onDetected]);

  return <div id="barcode-scanner" className="scanner-container" />;
}
