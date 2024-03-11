"use client";
import { useState, useEffect } from "react";
import Alert from "./Alert";

interface CapturedPrices {
  [symbol: string]: number | undefined; // Key is symbol (string), value is number or undefined
}

interface AlertCheckerProps {
  capturedPrices: CapturedPrices;
  alerts: Record<string, { condition: string; value: string | null }>;
  playAlertSound: (condition: string) => void;
}

const AlertChecker: React.FC<AlertCheckerProps> = ({
  capturedPrices,
  alerts,
  playAlertSound,
}) => {
  const [triggeredAlerts, setTriggeredAlerts] = useState<Record<string, { isTriggered: boolean; canRemove?: boolean | undefined }>>({});


  useEffect(() => {
    const checkAlerts = () => {
      const newTriggeredAlerts: Record<
        string,
        { isTriggered: boolean; canRemove?: boolean }
      > = {};
      for (const [symbol, alert] of Object.entries(alerts)) {
        const currentPrice = capturedPrices[symbol];
        if (currentPrice === undefined) {
          continue; // Skip if price data unavailable
        }

        const isTriggered =
          alert.value !== null
            ? alert.condition === "higher"
              ? currentPrice > parseFloat(alert.value)
              : currentPrice < parseFloat(alert.value)
            : false; // If alert.value is null, consider the alert not triggered

        newTriggeredAlerts[symbol] = { isTriggered, canRemove: true }; // Set canRemove to true by default
        // Play sound if triggered (assuming you want sound for each alert)
        if (isTriggered) {
          playAlertSound(alert.condition);
        }
      }
      setTriggeredAlerts(newTriggeredAlerts);
    };

    checkAlerts();
  }, [capturedPrices, alerts, playAlertSound]);

  const handleAlertRemoval = (symbol: string) => {
    setTriggeredAlerts((prevTriggeredAlerts) => {
      const updatedAlerts = { ...prevTriggeredAlerts };
      delete updatedAlerts[symbol];
      return updatedAlerts;
    });
  };



  return Object.keys(triggeredAlerts).length > 0
    ? Object.entries(triggeredAlerts).map(
        ([symbol, { isTriggered, canRemove }]) =>
          isTriggered && (
            <Alert
              key={symbol}
              symbol={symbol}
              price={capturedPrices[symbol]}
              onRemove={canRemove ? handleAlertRemoval.bind(null, symbol) : undefined}// Pass removal function with symbol
            />
          )
      )
    : null;
};

export default AlertChecker;
