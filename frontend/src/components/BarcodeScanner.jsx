import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        decoder: {
          readers: ["code_128_reader"],
        },
        locate: true,
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      if (code) {
        Quagga.stop();
        onDetected(code);
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [onDetected]);

  return <div ref={scannerRef} className="scanner-container" />;
}
