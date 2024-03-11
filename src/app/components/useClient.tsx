'use client';
import { useEffect, useState, useCallback } from "react";

interface Alert {
    symbol: string;
    condition: 'higher' | 'lower';
    value: string | null;
  }

const useClient = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([]);

  useEffect(() => {
    const wsEndpoint = "wss://stream.binance.com:9443";
    const ws = new WebSocket(`${wsEndpoint}/ws`);

    ws.onopen = () => {
      const topCoins = [
        "btcusdt",
        "ethusdt",
        "flokiusdt",
        "wifusdt",
        "galausdt",
      ];
      topCoins.forEach((coin) =>
        ws.send(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: [`${coin}@trade`],
            id: 1,
          })
        )
      );
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      const symbol = newData.s;
      const price = parseFloat(newData.p);
      setPrices((prevPrices) => ({ ...prevPrices, [symbol]: price }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert(
        "WebSocket connection error occurred. Please refresh the page to reconnect."
      );
    };

    return () => {
      ws.close();
    };
  }, []);
  
  return { prices, triggeredAlerts };
};

export default useClient;