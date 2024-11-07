import React from 'react';
import Chart from 'react-apexcharts';

export interface BarChartInterface {
  data: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  yaxisLabels: string[];
  color?: string;
  className?: string;
}

export default function BarChart({ categories, data, color, yaxisLabels }: BarChartInterface) {
  const options = {
    chart: {
      type: 'bar',
      height: 410,
      toolbar: {
        show: false,
      },
      fontFamily: 'var(--font-iran-sans)', // Use your custom font globally in the chart
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '8px',
        borderRadius: 4,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontFamily: 'var(--font-iran-sans-bold)', // Bold font for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          const index = Math.round(value);
          return yaxisLabels[index] || index;
        },
        style: {
          fontFamily: 'var(--font-iran-sans-medium)', // Medium font for y-axis labels
        },
      },
    },
    fill: {
      opacity: 1,
      colors: [color],
    },
    tooltip: {
      y: {
        formatter: (val: any) => `${val}`,
      },
      style: {
        fontFamily: 'var(--font-iran-sans-medium)', // Medium font for tooltips
      },
    },
  } as any;

  return (
    <Chart
      options={options}
      series={data} // Series should be an array of objects
      type="bar"
      height={410}
    />
  );
}
