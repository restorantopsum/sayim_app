import { useState } from "react";
import SayimPage from "./pages/SayimPage";
import HesabatPage from "./pages/HesabatPage";

export default function App() {
  const [tab, setTab] = useState("sayim");

  return (
    <div className="app">
      <div className="content">
        {tab === "sayim" ? <SayimPage /> : <HesabatPage />}
      </div>
      <nav className="bottom-tabs">
        <button
          className={tab === "sayim" ? "active" : ""}
          onClick={() => setTab("sayim")}
        >
          Sayım
        </button>
        <button
          className={tab === "hesabat" ? "active" : ""}
          onClick={() => setTab("hesabat")}
        >
          Hesabat
        </button>
      </nav>
    </div>
  );
}
