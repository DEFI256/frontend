import React from 'react';
import ReactECharts from 'echarts-for-react';

const Volume = ({ data }) => {
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
        data: data.map(item => item.volume),
        type: 'bar',
        itemStyle: {
          color: '#87CEEB', // 天蓝色
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />;
};

export default Volume;



