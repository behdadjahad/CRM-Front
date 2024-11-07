import React from 'react';
import Chart from 'react-apexcharts';

export interface PieChartInterface {
  data: number[];
  labels: string[];
  colors?: string[];
  className?: string;
}

export default function PieChart({ data, labels, colors }: PieChartInterface) {
  const options = {
    chart: {
      type: 'pie',
      height: 410,
      toolbar: {
        show: false,
      },
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        colors: ['#FFFFFF'],
        fontFamily: 'var(--font-iran-sans-medium)',
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.6,
      },
      offsetX: 10, // Horizontal offset for better centering
      offsetY: 100, // Vertical offset for better centering
      textAnchor: 'center', // Ensures the text anchor is centered
    },
    fill: {
      colors,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
      style: {
        fontFamily: 'var(--font-iran-sans-medium)',
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontFamily: 'var(--font-iran-sans-medium)',
    },
  } as any;

  return (
    <Chart
      options={options}
      series={data}
      type="pie"
      height={250}
    />
  );
}
