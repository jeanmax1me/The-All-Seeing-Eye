import { useState , useEffect } from 'react';

interface ActiveAlertProps {
  alerts: Record<string, { condition: string; value: string | null }>;
}

const ActiveAlerts: React.FC<ActiveAlertProps & { prices: Record<string, number> }> = ({ alerts, prices }) => {

    return (
        <div className="mt-8">
          <h2>Active Alerts</h2>
          {Object.entries(alerts).map(([symbol, alert]) => {
            const currentPrice = prices[symbol]; // Access price from props 
            // Check if current price meets the alert condition
            const isTriggered = (condition: string, price: number, value: string | null) => {
              if (value === null) return false; // Handle null values gracefully
    
              return (condition === "higher" && currentPrice > parseFloat(value)) ||
                     (condition === "lower" && currentPrice < parseFloat(value));
            };
    
            const triggered = isTriggered(alert.condition, currentPrice, alert.value);
    
            return (
              <Alert
                key={symbol}
                symbol={symbol}
                condition={alert.condition}
                value={alert.value}
                triggered={triggered} // Pass the triggered flag
              />
            );
          })}
        </div>
      );
    };


export default ActiveAlerts;

interface AlertProps {
    symbol: string;
    condition: string;
    value: string | null;
    triggered?: boolean; // Optional triggered prop
  }
  
  const Alert: React.FC<AlertProps> = ({ symbol, condition, value, triggered }) => {
  return (
    <div className="border rounded p-2 mb-2">
      <p>
        {symbol} - {condition} at {value} (if price is {condition === "higher" ? "above" : "below"}).
      </p>
    </div>
  );
};
