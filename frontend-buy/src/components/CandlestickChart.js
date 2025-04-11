import React from 'react';
import ReactECharts from 'echarts-for-react';

const CandlestickChart = ({ data, timeRange }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#87CEEB',
      textStyle: { color: '#fff' },
      // eslint-disable-next-line no-template-curly-in-string
      formatter: (params) => {
        const dataIndex = params[0].dataIndex;
        const time = data[dataIndex][0];
        const [open, close, low, high] = data[dataIndex][1];
        return `
          <div style="font-size: 14px;">
            <strong>${time}</strong><br/>
            开盘价: $${open.toFixed(2)}<br/>
            收盘价: $${close.toFixed(2)}<br/>
            最高价: $${high.toFixed(2)}<br/>
            最低价: $${low.toFixed(2)}
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item[0]),
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value);
          switch (timeRange) {
            case '1H':
              return `${String(date.getHours()).padStart(2, '0')}:00`;
            case '1D':
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            case '1W':
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            case '1M':
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            case '1Y':
              return `${date.getFullYear()}`;
            default:
              return value;
          }
        },
      },
    },
    yAxis: {
      type: 'value',
      // eslint-disable-next-line no-template-curly-in-string
      axisLabel: { formatter: '${value}' },
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100 },
    ],
    series: [
      {
        type: 'candlestick',
        data: data.map(item => item[1]),
        itemStyle: {
          color: '#87CEEB',
          color0: '#FF69B4',
          borderColor: '#87CEEB',
          borderColor0: '#FF69B4',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} key={timeRange} />;
};

export default CandlestickChart;