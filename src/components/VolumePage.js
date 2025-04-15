import React from 'react';
import { Radio } from 'antd';
import Volume from './Volume';

const VolumePage = ({ data, timeRange, setTimeRange }) => {
  return (
    <div>
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
      <Volume data={data} />
    </div>
  );
};

export default VolumePage;


