

// PriceAlertForm component
interface PriceAlertFormProps {
    symbol: string;
    alert: { condition: string; value: string | null };
    handleAlertConditionChange: (symbol: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleAlertValueChange: (symbol: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleAlertSubmit: (symbol: string) => void;
  }

  const PriceAlertForm: React.FC<PriceAlertFormProps> = ({
    symbol,
    alert,
    handleAlertConditionChange,
    handleAlertValueChange,
    handleAlertSubmit,
  }) => {
    return (
      <div>
        <select
          value={alert.condition || ""}
          onChange={(event) => handleAlertConditionChange(symbol, event)}
          className="border rounded p-1 mr-2 text-zinc-800"
        >
          <option value="">Select condition</option>
          <option value="higher">Price is higher than</option>
          <option value="lower">Price is lower than</option>
        </select>
        <input
          type="text"
          pattern="[0-9]*\.?[0-9]*"
          value={alert.value || ""}
          onChange={(event) => handleAlertValueChange(symbol, event)}
          placeholder="Enter value"
          className="border rounded p-1 text-zinc-800"
        />
        <button
          onClick={() => handleAlertSubmit(symbol)}
          className="bg-blue-500 text-white py-1 px-3 ml-2 rounded"
        >
          Set Alert
        </button>
      </div>
    );
  };

  export default PriceAlertForm;