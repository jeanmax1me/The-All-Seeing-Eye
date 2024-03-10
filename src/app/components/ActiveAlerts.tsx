interface ActiveAlertProps {
  alerts: Record<string, { condition: string; value: string | null }>;
}

const ActiveAlerts: React.FC<ActiveAlertProps> = ({ alerts }) => {
  return (
    <div className="mt-8">
      <h2>Active Alerts</h2>
      {Object.entries(alerts).map(([symbol, alert]) => (
        <Alert key={symbol} symbol={symbol} condition={alert.condition} value={alert.value} />
      ))}
    </div>
  );
};

export default ActiveAlerts;

const Alert: React.FC<{ symbol: string; condition: string; value: string | null }> = ({ symbol, condition, value }) => {
  return (
    <div className="border rounded p-2 mb-2">
      <p>
        {symbol} - {condition} at {value} (if price is {condition === "higher" ? "above" : "below"}).
      </p>
    </div>
  );
};
