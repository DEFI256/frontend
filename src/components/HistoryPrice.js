import React from 'react';
import ReactECharts from 'echarts-for-react';

const HistoryPrice = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.time),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return '$' + value;
        },
      },
    },
    series: [
      {
        data: data.map(item => item.price),
        type: 'line',
        areaStyle: {
          color: '#87CEEB', // 天蓝色
          opacity: 0.2,
        },
        lineStyle: {
          color: '#87CEEB',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />;
};

export default HistoryPrice;




