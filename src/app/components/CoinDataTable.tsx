"use client";
import { useState, useEffect, useRef } from "react";
import PriceTable from "./PriceTable";
import ActiveAlerts from "./ActiveAlerts";
import useClient from './useClient';
import AlertChecker from './AlertChecker'; 

interface CapturedPrices {
  [symbol: string]: number | undefined; // Key is symbol (string), value is number or undefined
}

const TopCoinsPriceTracker: React.FC = () => {
  const { prices, triggeredAlerts } = useClient();
  const [alerts, setAlerts] = useState<
    Record<string, { condition: string; value: string | null }>
  >({});
  const [alertSet, setAlertSet] = useState<boolean>(false);
  const [capturedPrices, setCapturedPrices] = useState<CapturedPrices>({});
  const lastUpdateTimeRef = useRef(Date.now()); // Track last update time

  useEffect(() => {
    const captureData = async () => {
      // ... your logic to fetch or access prices
      const updatedCapturedPrices = prices; // Create a copy
      setCapturedPrices(updatedCapturedPrices); // Update the state
    };
    captureData(); // Call it initially
  
    const intervalId = setInterval(captureData, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [prices]); // Add prices as a dependency

  useEffect(() => {
    console.log("Captured prices:", capturedPrices);
  }, [capturedPrices]);

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
      <AlertChecker
        capturedPrices={capturedPrices}
        alerts={alerts}
      />
      {alertSet && Object.keys(alerts).length > 0 && (
        <ActiveAlerts alerts={alerts} prices={capturedPrices} />
      )}
    </div>
  );
};

export default TopCoinsPriceTracker;
