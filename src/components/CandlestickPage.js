import React from 'react';
import { Radio } from 'antd';
import CandlestickChart from './CandlestickChart';

const CandlestickPage = ({ data, timeRange, setTimeRange }) => {
  return (
    <div>
      <h1>CandlestickChart</h1>
      <div style={{ marginBottom: 20 }}>
        <Radio.Group
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="1H">1H</Radio.Button>
          <Radio.Button value="1D">1D</Radio.Button>
          <Radio.Button value="1W">1W</Radio.Button>
          <Radio.Button value="1M">1M</Radio.Button>
          <Radio.Button value="1Y">1Y</Radio.Button>
        </Radio.Group>
      </div>
      <CandlestickChart data={data} />
    </div>
  );
};

export default CandlestickPage;