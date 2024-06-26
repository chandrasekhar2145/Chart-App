import React, { useEffect, useState } from 'react';
import './index.css'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';

interface DataPoint {
  timestamp: string;
  value: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<string>('daily');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/data.json');
      setData(result.data);
    };
    fetchData();
  }, []);

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
  };

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      alert(`Timestamp: ${data.activeLabel}\nValue: ${data.activePayload[0].value}`);
    }
  };

  const exportChart = () => {
    const chartElement = document.getElementById('chart');
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="bg-container">
      <h1 className="chart-heading">Charting App</h1>
      <div className="timeframe-con">
        <label htmlFor="timeframe">Timeframe:</label>
        <select id="timeframe" value={timeframe} onChange={handleTimeframeChange} className="select-option">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <button type="button" className="button" onClick={exportChart}>Export Chart</button>
      <div id="chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} onClick={handlePointClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#eeaeca" fill='#fff' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
