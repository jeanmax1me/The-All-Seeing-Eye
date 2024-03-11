'use client';
import { useState, useEffect } from 'react';
import Alert from "./Alert"; 

interface CapturedPrices {
  [symbol: string]: number | undefined; // Key is symbol (string), value is number or undefined
}

interface AlertCheckerProps {
  capturedPrices: CapturedPrices;
  alerts: Record<string, { condition: string; value: string | null }>;
  onAlertTrigger?: (symbol: string, triggered: boolean) => void; // Optional callback
}

const AlertChecker: React.FC<AlertCheckerProps> = ({ capturedPrices, alerts, onAlertTrigger }) => {
  const [triggeredAlerts, setTriggeredAlerts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkAlerts = () => {
      const newTriggeredAlerts: Record<string, boolean> = {};
      for (const [symbol, alert] of Object.entries(alerts)) {
        const currentPrice = capturedPrices[symbol];
        if (currentPrice === undefined) {
          continue; // Skip if price data unavailable
        }

        const isTriggered = alert.value !== null
        ? alert.condition === "higher"
            ? currentPrice > parseFloat(alert.value)
            : currentPrice < parseFloat(alert.value)
        : false; // If alert.value is null, consider the alert not triggered
      
      newTriggeredAlerts[symbol] = isTriggered;   
      }
      setTriggeredAlerts(newTriggeredAlerts);
    };

    checkAlerts();
  }, [capturedPrices, alerts]); // Update on price/alert changes

  return Object.keys(triggeredAlerts).length > 0 ? (
    Object.entries(triggeredAlerts).map(([symbol, isTriggered]) => (
      isTriggered && <Alert key={symbol} symbol={symbol} price={capturedPrices[symbol]} />
    ))
  ) : null;
};

export default AlertChecker;
