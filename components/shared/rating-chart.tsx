"use client"

import React from 'react';
import Chart from 'react-apexcharts';

export interface RatingChartInterface {
  value: number;
  color?: string;
  height?: number;
}

export default function RatingChart({ value, color, height = 96 }: RatingChartInterface) {
  const options = {
    chart: {
      type: 'radialBar',
      toolbar: {
        show: false,
      },
      fontFamily: 'var(--font-iran-sans)',
    },

    plotOptions: {
      radialBar: {
        hollow: {
          size: '50%',
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -5,
            fontSize: '8px',
            color: '#637381',
            fontFamily: 'var(--font-iran-sans-bold)',
          },
          value: {
            show: true,
            fontSize: '10px',
            offsetY: -3, // Center the value text slightly below the name
            formatter: () => `${(value / 10).toFixed(1)}/10`, // Format to show "3.0/10"
            borderRadius: 4,
          },
        },
      },
    },
    labels: ['میانگین امتیاز'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#79521B'], // Ending color of the gradient
        stops: [0, 100],
      },
    },
    colors: [color || '#FFA500'],
    tooltip: {
      enabled: false,
    },
  } as any;

  return (
    <Chart
      options={options}
      series={[value]}
      type="radialBar"
      height={height} />
  );
}
