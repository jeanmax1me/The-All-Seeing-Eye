import PriceAlertForm from "./PriceAlertsForm";

interface PriceTableProps {
    prices: Record<string, number>;
    alerts: Record<string, { condition: string; value: string | null }>;
    handleAlertConditionChange: (symbol: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleAlertValueChange: (symbol: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleAlertSubmit: (symbol: string) => void;
  }
  
const PriceTable: React.FC<PriceTableProps> = ({
    prices,
    alerts,
    handleAlertConditionChange, 
    handleAlertValueChange,
    handleAlertSubmit,
  }) => {
    return (
      <div className="space-y-2">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800">
            <th className="py-2 px-4">Coin</th>
            <th className="py-2 px-4">Price (USDT)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices)
            .filter(([_, price]) => !isNaN(price))
            .map(([symbol, price]) => (
              <tr key={symbol} className="border-b">
                <td className="py-2 px-4 symbol">{symbol.split("USDT")[0]}</td>
                <td className="py-2 px-4 price">{price}</td>
                <td className="py-2 px-4">
                  <PriceAlertForm
                    symbol={symbol}
                    alert={alerts[symbol] || {}}
                    handleAlertConditionChange={handleAlertConditionChange}
                    handleAlertValueChange={handleAlertValueChange}
                    handleAlertSubmit={handleAlertSubmit}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      
      </div>
    );
  };
  
  export default PriceTable;
  