import { useState } from 'react';
import axios from 'axios';

import './App.css'
import { currencyCodes } from './data';

function App() {

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        formData
      );
      setResult(response?.data);
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError(
        "Error",
        error?.response ? error?.response?.data : error?.message
      );
    }
  };

  return (
    <div>
      <section className="hero">
        <h1>Global Currency Converter</h1>
        <p>Your go-to solution for real-time currency conversions worldwide.</p>
      </section>

      <section className="converter">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="from">From:</label>
            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select From Currency</option>
              {currencyCodes.map((code, index) => (
                <option key={index} value={code.substring(0, 3)}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="to">To:</label>
            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select To Currency</option>
              {currencyCodes.map((code, index) => (
                <option key={index} value={code.substring(0, 3)}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            type="number"
            className="input"
            required
          />
          <button type="submit" className="submit-btn">
            Convert
          </button>
        </form>
        {loading ? <h1 className='result'>Loading...</h1> : error ? <p className="error">Error: {error}</p> : result? (
          
          <div className="result">
            <p>
              Converted Amount: {result.convertedAmount} {result.target}
            </p>
            <p>Conversion Rate: {result.conversionRate}</p>
          </div>
        ): null}
        {/* {error && <p className="error">Error: {error}</p>} */}
      </section>

      <section className="additional-info">
        <h2>Why Choose Global Currency Converter?</h2>
        <p>Detailed explanations on advantages or instructions for use.</p>
      </section>

    </div>
  );
}

export default App;