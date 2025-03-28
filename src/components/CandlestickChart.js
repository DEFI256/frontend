import React from 'react';
import ReactECharts from 'echarts-for-react';

const CandlestickChart = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // 鼠标悬停时显示十字准线
      },
      // Tooltip 美化样式
      backgroundColor: 'rgba(50, 50, 50, 0.9)', // 深色背景
      borderColor: '#87CEEB', // 天蓝色边框
      textStyle: {
        color: '#fff', // 白色文字
      },
      formatter: (params) => {
        const dataIndex = params[0].dataIndex;
        const time = data[dataIndex][0]; // 获取时间
        const candlestickData = data[dataIndex][1]; // 获取 K 线数据 [open, close, low, high]
        const [open, close, low, high] = candlestickData;

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
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}',
      },
    },
    // 缩放功能
    dataZoom: [
      {
        type: 'inside', // 鼠标滚轮缩放
        start: 0,
        end: 100,
      },
      {
        type: 'slider', // 底部滑块缩放
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        type: 'candlestick',
        data: data.map(item => item[1]),
        itemStyle: {
          color: '#87CEEB', // 天蓝色（上涨）
          color0: '#FF69B4', // 粉红色（下跌）
          borderColor: '#87CEEB', // 天蓝色边框（上涨）
          borderColor0: '#FF69B4', // 粉红色边框（下跌）
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />;
};

export default CandlestickChart;