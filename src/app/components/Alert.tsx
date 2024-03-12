interface AlertProps {
  symbol: string;
  price: number | undefined;
}

const Alert: React.FC<AlertProps & { onRemove?: () => void }> = ({
    symbol,
    price,
    onRemove, 
  }) => {
    return (
      <div className="bg-red-500 text-white p-4 rounded-md mt-4 flex justify-between items-center">
        <span>{symbol} alert triggered! (Value: {price || 'N/A'})</span>
        {onRemove && <button onClick={onRemove}>Dismiss</button>}
      </div>
    );
  };

export default Alert;
