import React from 'react';

interface AlertProps {
  symbol: string;
  price: number | undefined;
}

const Alert: React.FC<AlertProps> = ({ symbol, price }) => {
  return (
    <div className="alert alert-danger">
      {symbol} alert triggered! (Value: {price || 'N/A'})
    </div>
  );
};

export default Alert;
