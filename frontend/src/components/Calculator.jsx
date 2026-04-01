export default function Calculator({ value, onChange, onConfirm }) {
  const handlePress = (key) => {
    if (key === "C") {
      onChange("");
    } else if (key === "⌫") {
      onChange(value.slice(0, -1));
    } else if (key === "✓") {
      onConfirm();
    } else if (key === "+") {
      // evaluate existing expression first, then append +
      onChange(value + "+");
    } else {
      onChange(value + key);
    }
  };

  const buttons = [
    ["7", "8", "9", "⌫"],
    ["4", "5", "6", "C"],
    ["1", "2", "3", "✓"],
    ["0", ".", "+", null],
  ];

  return (
    <div className="calculator">
      {buttons.map((row, i) => (
        <div key={i} className="calc-row">
          {row.map((btn, j) => {
            if (btn === null) return null;
            // ✓ button spans 2 rows
            if (btn === "✓") {
              return (
                <button
                  key={j}
                  className="calc-btn confirm-btn"
                  onClick={() => handlePress(btn)}
                >
                  {btn}
                </button>
              );
            }
            return (
              <button
                key={j}
                className={`calc-btn ${btn === "⌫" || btn === "C" ? "action-btn" : ""}`}
                onClick={() => handlePress(btn)}
              >
                {btn}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
