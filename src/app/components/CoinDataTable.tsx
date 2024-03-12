"use client";
import { useState, useEffect, useRef } from "react";
import PriceTable from "./PriceTable";
import ActiveAlerts from "./ActiveAlerts";
import useClient from './useClient';
import AlertChecker from './AlertChecker'; 

interface CapturedPrices {
  [symbol: string]: number | undefined; 
}

const TopCoinsPriceTracker: React.FC = () => {
  const { prices, triggeredAlerts } = useClient();
  const [alerts, setAlerts] = useState<
    Record<string, { condition: string; value: string | null }>
  >({});
  const [alertSet, setAlertSet] = useState<boolean>(false);
  const [capturedPrices, setCapturedPrices] = useState<CapturedPrices>({});
  const lastUpdateTimeRef = useRef(Date.now()); 

  useEffect(() => {
    const captureData = async () => {
      const currentTime = Date.now();

      // Throttle updates to every 5 seconds using a flag
      if (currentTime - lastUpdateTimeRef.current >= 4000) {
        const updatedPrices = prices; 
        setCapturedPrices(updatedPrices);
        lastUpdateTimeRef.current = currentTime; 
      }
    };

    captureData();

    const intervalId = setInterval(captureData, 10); 

    return () => clearInterval(intervalId);
  }, [prices]); 


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
  };

  const handleAlertDismiss = (symbolToRemove: string) => {
    setAlerts((prevAlerts) => {
      const newAlerts = { ...prevAlerts };
      delete newAlerts[symbolToRemove];
      return newAlerts;
    });
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
        <ActiveAlerts alerts={alerts} prices={capturedPrices}  onDismiss={handleAlertDismiss} />
      )}
       <AlertChecker capturedPrices={capturedPrices} alerts={alerts} playAlertSound={playAlertSound} />
    </div>
  );
};

export default TopCoinsPriceTracker;
