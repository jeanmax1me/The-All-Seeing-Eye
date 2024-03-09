'use client';
import { useEffect, useState, useCallback } from "react";

const TopCoinsPriceTracker: React.FC = () => {
    const [prices, setPrices] = useState<{ [key: string]: number }>({});
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<string>("");
    const [alertCondition, setAlertCondition] = useState<string>("");
    const [alertValue, setAlertValue] = useState<number | null>(null);
    const [alerts, setAlerts] = useState<{
      [key: string]: { condition: string; value: string | null };
    }>({});
    const [alertSet, setAlertSet] = useState<boolean>(false); // Track whether an alert has been set
  
    const checkAlerts = useCallback(() => {
        // Your alert checking logic here
        Object.entries(alerts).forEach(([symbol, alert]) => {
          if (prices[symbol] != null && alert.value != null) {
            if (
              (alert.condition === "higher" && prices[symbol] > parseFloat(alert.value)) ||
              (alert.condition === "lower" && prices[symbol] < parseFloat(alert.value))
            ) {
              console.log(`Alert for ${symbol}: Condition - ${alert.condition}, Value - ${alert.value}`);
            }
          }
        });
      }, [alerts, prices]);

    useEffect(() => {
        const intervalId = setInterval(checkAlerts, 3000);
      
        return () => clearInterval(intervalId);
      }, [checkAlerts]);


  const handleAlertConditionChange = (
    symbol: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const condition = event.target.value;
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [symbol]: {
        ...prevAlerts[symbol],
        condition,
      },
    }));
  };

  const handleAlertValueChange = (
    symbol: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as string; // Assert as number

    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [symbol]: {
        ...prevAlerts[symbol],
        value,
      },
    }));
  };

  const handleAlertSubmit = (symbol: string) => {
    const { condition, value } = alerts[symbol];
    // Implement your alert logic here
    console.log(
      `Alert for ${symbol}: Condition - ${condition}, Value - ${value}`
    );
    setAlertSet(true); // Set alert flag to true when an alert is submitted
  };

  const hasActiveAlerts = () => {
    return Object.keys(alerts).length > 0;
  };

  useEffect(() => {
    const wsEndpoint = "wss://stream.binance.com:9443";
    const topCoins = [
      "btcusdt",
      "ethusdt",
      "flokiusdt",
      "wifusdt",
      "ftmusdt",
    ];

    const subscribeMessages = topCoins.map((coin) => ({
      method: "SUBSCRIBE",
      params: [`${coin}@trade`],
      id: 1,
    }));

    const newWs = new WebSocket(`${wsEndpoint}/ws`);
    setWs(newWs);

    newWs.onopen = () => {
      console.log("WebSocket connected");
      subscribeMessages.forEach((message) =>
        newWs.send(JSON.stringify(message))
      );
    };

    newWs.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      const symbol = newData.s;
      const price = parseFloat(newData.p);

      setPrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: price,
      }));
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      console.log("WebSocket readyState:", newWs.readyState);

      if (error instanceof Event) {
        // If the error is an Event object, log its type, target, and any other relevant properties
        console.log("WebSocket error event:", {
          type: error.type,
          target: error.target,
          timestamp: error.timeStamp,
        });
      } else {
        console.log("WebSocket error:", {
          type: typeof error,
        });
      }
    };

    return () => {
      newWs.close();
    };
  }, []);

  return (
    <div className="max-w-screen-md mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800">
            <th className="py-2 px-4">Coin</th>
            <th className="py-2 px-4">Price (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices)
            .filter(([_, price]) => !isNaN(price))
            .map(([symbol, price]) => (
              <tr key={symbol} className="border-b">
                <td className="py-2 px-4 symbol">{symbol.split("USDT")[0]}</td>
                <td className="py-2 px-4 price">{price}</td>
                <td className="py-2 px-4">
                  <select
                    value={alerts[symbol]?.condition || ""}
                    onChange={(event) =>
                      handleAlertConditionChange(symbol, event)
                    }
                    className="border rounded p-1 mr-2 text-zinc-800"
                  >
                    <option value="">Select condition</option>
                    <option value="higher">Price is higher than</option>
                    <option value="lower">Price is lower than</option>
                  </select>
                  <input
                    type="text"
                    pattern="[0-9]*\.?[0-9]*"
                    value={alerts[symbol]?.value || ""}
                    onChange={(event) => handleAlertValueChange(symbol, event)}
                    placeholder="Enter value"
                    className="border rounded p-1 text-zinc-800"
                  />

                  <button
                    onClick={() => handleAlertSubmit(symbol)}
                    className="bg-blue-500 text-white py-1 px-3 ml-2 rounded"
                  >
                    Set Alert
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Active Alerts section */}
      {alertSet && hasActiveAlerts() && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          {Object.entries(alerts).map(([symbol, alert], index) => (
            <div key={index} className="mb-2">
              <span className="mr-2">{symbol}: </span>
              {alert.condition === "higher" ? (
                <span>Price is higher than {alert.value}</span>
              ) : (
                <span>Price is lower than {alert.value}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopCoinsPriceTracker;
