'use client';
import { useState, useEffect } from 'react';

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
      // ... existing logic to check alerts ...
      if (onAlertTrigger) {
        for (const [symbol, isTriggered] of Object.entries(triggeredAlerts)) {
          onAlertTrigger(symbol, isTriggered);
        }
      }
    };

    checkAlerts();
  }, [capturedPrices, alerts]); // Update on price/alert changes

  return null; // This component doesn't render any UI
};

export default AlertChecker;
