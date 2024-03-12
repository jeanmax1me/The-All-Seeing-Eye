import React from "react";

interface CapturedPrices {
  [symbol: string]: number | undefined; 
}

interface ActiveAlertProps {
  alerts: Record<string, { condition: string; value: string | null }>;
  prices: CapturedPrices;
  onDismiss?: (symbol: string) => void;
}



const ActiveAlerts: React.FC<ActiveAlertProps> = ({ alerts, prices, onDismiss }) => {
  const handleDismiss = (symbol: string) => {
    // Check if onDismiss is a function before calling
    if (typeof onDismiss === "function") {
      onDismiss(symbol);
    } else {
      console.warn("onDismiss function not provided by parent component.");
    }
  };
  return (
    <div className="mt-8">
      <h2>Active Alerts</h2>
      <div className="space-y-2">
        {Object.entries(alerts).map(([symbol, alert]) => {
          const currentPrice = prices[symbol];
          if (currentPrice === undefined) return null; // Handle missing prices gracefully

          return (
            <div
              key={symbol}
              className={`p-4 rounded ${
                alert.condition === "higher"
                  ? "bg-blue-100 text-blue-700 border-blue-400"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>
                  {symbol} -{" "}
                  {alert.condition === "higher"
                    ? "if price is higher than"
                    : "if price is below"}{" "}
                  {alert.value}.
                </span>

                {alert.condition === "higher" ? (
                   <span className="text-green-500 font-bold">&#8593;</span> 
                   ) : (
                     <span className="text-red-500 font-bold">&#8595;</span> 
                )}
                <button onClick={() => handleDismiss(symbol)}>Dismiss</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveAlerts;
