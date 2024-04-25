import React, { useState } from 'react';
import './App.css';

interface StockData {
  code: string;
  cost: number;
  to_buy: number;
  ask_price: number;
}

interface PortfolioData {
  market_value: number;
  code: string;
  price: number;
  expected_distribution: number;
  distribution: number;
  quantity_owned: number;
}

interface LambdaResponse {
  stocks_to_buy: { total_cost: number; amount_to_invest: number; stocks: StockData[] };
  original_portfolio: { total_market_value: number; stocks: PortfolioData[] };
  new_portfolio: { total_market_value: number; stocks: PortfolioData[] };
}

interface InputData {
  quantity: { [key: string]: number };
  expected_distribution: { [key: string]: number };
  investment: number;
}

const App: React.FC = () => {
  const [stocksData, setStocksData] = useState<LambdaResponse | null>(null);
  const [inputData, setInputData] = useState<InputData>({
    quantity: { 'VGS.AX': 0, 'VISM.AX': 0, 'VGE.AX': 0, 'VGAD.AX': 0 },
    expected_distribution: { 'VGS.AX': 72.2037037, 'VISM.AX': 12.03703704, 'VGE.AX': 9.259259259, 'VGAD.AX': 6.5 },
    investment: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, stockCode: string, field: keyof InputData) => {
    const { value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], [stockCode]: parseInt(value, 10) || 0 },
    }));
  };

  const handleCalculateClick = async () => {
    try {
      const response = await fetch('https://ruc2oaiq2xxds2f7qed6b4ctfi0vvptm.lambda-url.ap-southeast-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      const data: LambdaResponse = await response.json();
      setStocksData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Stock Code</th>
              <th>Quantity</th>
              <th>Expected Distribution</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(inputData.quantity).map((stockCode) => (
              <tr key={stockCode}>
                <td>{stockCode}</td>
                <td>
                  <input
                    type="number"
                    value={inputData.quantity[stockCode]}
                    onChange={(e) => handleInputChange(e, stockCode, 'quantity')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={inputData.expected_distribution[stockCode]}
                    onChange={(e) => handleInputChange(e, stockCode, 'expected_distribution')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <label htmlFor="investment">Investment Amount:</label>
        <input
          type="number"
          id="investment"
          value={inputData.investment}
          onChange={(e) => setInputData({ ...inputData, investment: parseInt(e.target.value, 10) || 0 })}
        />
      </div>
      <button onClick={handleCalculateClick}>Calculate</button>

      {/* Display tables using stocksData */}
      {stocksData && (
        <div>
          {/* Display Table 1: Stocks to Buy */}
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Cost</th>
                <th>To Buy</th>
                <th>Ask Price</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.stocks_to_buy.stocks.map((stock) => (
                <tr key={stock.code}>
                  <td>{stock.code}</td>
                  <td>{stock.cost}</td>
                  <td>{stock.to_buy}</td>
                  <td>{stock.ask_price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Table 2: Original Portfolio */}
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Market Value</th>
                <th>Price</th>
                <th>Expected Distribution</th>
                <th>Distribution</th>
                <th>Quantity Owned</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.original_portfolio.stocks.map((stock) => (
                <tr key={stock.code}>
                  <td>{stock.code}</td>
                  <td>{stock.market_value}</td>
                  <td>{stock.price}</td>
                  <td>{stock.expected_distribution}</td>
                  <td>{stock.distribution}</td>
                  <td>{stock.quantity_owned}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Table 3: New Portfolio */}
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Market Value</th>
                <th>Price</th>
                <th>Expected Distribution</th>
                <th>Distribution</th>
                <th>Quantity Owned</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.new_portfolio.stocks.map((stock) => (
                <tr key={stock.code}>
                  <td>{stock.code}</td>
                  <td>{stock.market_value}</td>
                  <td>{stock.price}</td>
                  <td>{stock.expected_distribution}</td>
                  <td>{stock.distribution}</td>
                  <td>{stock.quantity_owned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;