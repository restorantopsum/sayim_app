import { useEffect, useRef, useState } from "react";
import { BarcodeDetector as BarcodeDetectorPolyfill } from "barcode-detector";

const getDetector = () => {
  const Detector = window.BarcodeDetector || BarcodeDetectorPolyfill;
  return new Detector({
    formats: ["code_128", "ean_13", "ean_8", "upc_a", "upc_e"],
  });
};

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stopped = false;
    let animFrame = null;

    const start = async () => {
      try {
        const detector = getDetector();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (stopped) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const scan = async () => {
          if (stopped) return;
          try {
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              if (code) {
                stream.getTracks().forEach((t) => t.stop());
                onDetected(code);
                return;
              }
            }
          } catch (e) {
            // frame not ready, skip
          }
          animFrame = requestAnimationFrame(scan);
        };

        scan();
      } catch (err) {
        setError("Xəta: " + err.message);
        alert("Scanner xəta: " + err.message);
      }
    };

    start();

    return () => {
      stopped = true;
      if (animFrame) cancelAnimationFrame(animFrame);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onDetected]);

  return (
    <div className="scanner-container">
      {error && <div style={{ color: "red", padding: 8 }}>{error}</div>}
      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: 12 }}
        playsInline
        muted
      />
    </div>
  );
}
