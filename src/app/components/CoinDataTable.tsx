"use client";
import { useEffect, useState, useCallback } from "react";
import PriceTable from "./PriceTable";
import ActiveAlerts from "./ActiveAlerts";

const TopCoinsPriceTracker: React.FC = () => {
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [alerts, setAlerts] = useState<{
    [key: string]: { condition: string; value: string | null };
  }>({});
  const [alertSet, setAlertSet] = useState<boolean>(false); // Track whether an alert has been set
  const [intervalInitialized, setIntervalInitialized] =
    useState<boolean>(false);

  const checkAlerts = useCallback(() => {
    console.log("Checking alerts...");

    Object.entries(alerts).forEach(([symbol, alert]) => {
      if (prices[symbol] != null && alert.value != null) {
        if (
          (alert.condition === "higher" &&
            prices[symbol] > parseFloat(alert.value)) ||
          (alert.condition === "lower" &&
            prices[symbol] < parseFloat(alert.value))
        ) {
          console.log(
            `Alert for ${symbol}: Condition - ${alert.condition}, Value - ${alert.value}`
          );
        }
      }
    });
  }, [alerts, prices]);

  useEffect(() => {
    if (!intervalInitialized) {
      const intervalId = setInterval(checkAlerts, 3000);
      console.log("Alert checking interval started.");
      setIntervalInitialized(true);

      return () => {
        clearInterval(intervalId);
        console.log("Alert checking interval stopped.");
      };
    }
  }, [checkAlerts, intervalInitialized]);

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
    const value = event.target.value as string; // Assert as string for the moment

    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [symbol]: {
        ...prevAlerts[symbol],
        value,
      },
    }));
  };

  const checkAndTriggerAlert = (
    symbol: string,
    condition: string,
    value: string | null
  ) => {
    console.log(
      `Checking alert for ${symbol}: Condition - ${condition}, Value - ${value}`
    );

    if (
      value !== null &&
      ((condition === "higher" && prices[symbol] > parseFloat(value)) ||
        (condition === "lower" && prices[symbol] < parseFloat(value)))
    ) {
      console.log(
        `Alert triggered for ${symbol}: Condition - ${condition}, Value - ${value}`
      );
      playAlertSound(condition);
    } else {
      console.log(
        `Alert not triggered for ${symbol}: Condition - ${condition}, Value - ${value}`
      );
    }
  };

  const playAlertSound = (condition: string) => {
    const soundToPlay =
      condition === "higher" ? "alertHigherSound" : "alertLowerSound";
    const audioElement = document.getElementById(
      soundToPlay
    ) as HTMLAudioElement;

    if (audioElement) {
      audioElement.play();
    } else {
      console.warn("Audio element not found.");
    }
  };

  function handleAlertSubmit(symbol: string) {
    const { condition, value } = alerts[symbol];

    console.log(
      `Alert submitted for ${symbol}: Condition - ${condition}, Value - ${value}`
    );

    // Set the alert flag to true
    setAlertSet(true);

    checkAndTriggerAlert(symbol, condition, value);
  }

  const hasActiveAlerts = () => {
    return Object.keys(alerts).length > 0;
  };

  useEffect(() => {
    const wsEndpoint = "wss://stream.binance.com:9443";
    const topCoins = ["btcusdt", "ethusdt", "flokiusdt", "wifusdt", "galausdt"];

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

        // Display an error message to the user
        alert(
          "WebSocket connection error occurred. Please refresh the page to reconnect."
        );
      } else {
        console.log("WebSocket error:", {
          type: typeof error,
        });

        // Display an error message to the user
        alert(
          "WebSocket connection error occurred. Please refresh the page to reconnect."
        );
      }
    };
  }, []);

  return (
    <div className="max-w-screen-md mx-auto">
      <audio
        id="alertHigherSound"
        controls
        src="/audio/alertHigher.mp3"
      ></audio>
      <audio id="alertLowerSound" controls src="/audio/alertLower.mp3"></audio>
      <PriceTable
        prices={prices}
        alerts={alerts}
        handleAlertConditionChange={handleAlertConditionChange}
        handleAlertValueChange={handleAlertValueChange}
        handleAlertSubmit={handleAlertSubmit}
      />
      {alertSet && Object.keys(alerts).length > 0 && (
        <ActiveAlerts alerts={alerts} />
      )}
    </div>
  );
};

export default TopCoinsPriceTracker;
