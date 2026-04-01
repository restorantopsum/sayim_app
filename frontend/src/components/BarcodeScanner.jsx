import { useEffect, useRef } from "react";
import { BarcodeScanner as DBRScanner } from "dynamsoft-barcode-reader-bundle";

DBRScanner.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTA1MzU0MzI5LU1UQTFNelUwTXpJNUxYZGxZaTFVY21saGJGQnliMm8iLCJtYWluU2VydmVyVVJMIjoiaHR0cHM6Ly9tZGxzLmR5bmFtc29mdG9ubGluZS5jb20vIiwib3JnYW5pemF0aW9uSUQiOiIxMDUzNTQzMjkiLCJzdGFuZGJ5U2VydmVyVVJMIjoiaHR0cHM6Ly9zZGxzLmR5bmFtc29mdG9ubGluZS5jb20vIiwiY2hlY2tDb2RlIjotMTczMTE0MTMwOH0=";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const cameraEnhancerRef = useRef(null);

  useEffect(() => {
    let scanner = null;

    const init = async () => {
      try {
        scanner = await DBRScanner.createInstance();
        scannerRef.current = scanner;

        scanner.onUniqueRead = (txt) => {
          if (txt) {
            scanner.close();
            onDetected(txt);
          }
        };

        await scanner.open(document.getElementById("scanner-view"));
      } catch (err) {
        console.error("Dynamsoft init error:", err);
      }
    };

    init();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.close();
      }
    };
  }, [onDetected]);

  return <div id="scanner-view" className="scanner-container" />;
}
