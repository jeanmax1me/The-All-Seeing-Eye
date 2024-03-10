"use client";
import { useState, useEffect } from "react";
import PriceTable from "./PriceTable";
import ActiveAlerts from "./ActiveAlerts";
import useClient from './useClient';

const TopCoinsPriceTracker: React.FC = () => {
  const { prices, triggeredAlerts } = useClient();
  const [alerts, setAlerts] = useState<
    Record<string, { condition: string; value: string | null }>
  >({});
  const [alertSet, setAlertSet] = useState<boolean>(false);

  useEffect(() => {
    const captureData = () => {
      const capturedPrices = prices;
      console.log("Captured prices:", capturedPrices);
    };
    const intervalId = setInterval(captureData, 5000); // Capture every 5 seconds
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency on prices for re-capture on updates


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
    const value = event.target.value;
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
    console.log(
      `Alert submitted for ${symbol}: Condition - ${condition}, Value - ${value}`
    );
    setAlertSet(true);
    checkAndTriggerAlert(symbol, condition, value);
  };

  const checkAndTriggerAlert = (
    symbol: string,
    condition: string,
    value: string | null
  ) => {
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
        <ActiveAlerts alerts={alerts} prices={prices} />
      )}
      {triggeredAlerts.length > 0 && (
        <div>
          <h2>Triggered Alerts:</h2>
          <ul>
            {triggeredAlerts.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopCoinsPriceTracker;
