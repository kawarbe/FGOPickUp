import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';


const BarChart = ({ data }) => {
  const Width = 1400;
  const Height = 500;
  const margin = {
    top: 20,
    right: 45,
    bottom: 150,
    left: 80,
  };
  const chartWidth = Width - margin.left - margin.right;
  const chartHeight = Height - margin.top - margin.bottom;

  const sortedData = data.slice().sort((a, b) => {
    return b.days - a.days;
  });

  const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
  xScale.domain(sortedData.map((d) => d.name));
  const yScale = d3.scaleLinear().range([chartHeight, 0]);
  yScale.domain([0, d3.max(sortedData, (d) => d.days)]);

  var barWidth = xScale.bandwidth();
  var padding = chartWidth / data.length / 10;
  var barMargin;

  if (data.length < 90) {
    barMargin = 10;
  } else {
    barMargin = 0;
  }
  if (barWidth > 40) {
    barWidth = 40;
  }

  const bars = sortedData.map((d, index) => (
    <g key={index}>
      <rect x={barWidth * index + padding * index } y={yScale(d.days)} width={barWidth} height={chartHeight - yScale(d.days)} fill={d.NPcolor} className="barRect" />
      <text
        x={barWidth * index + padding * index + barMargin }
        y={chartHeight + 8}
        textAnchor="start"
        alignmentBaseline="middle"
        transform={`rotate(60,${barWidth * index + padding * index + barMargin },${chartHeight + 10})`}
        style={{ fontSize: "10px" }}
      >
        {d.name}
      </text>
    </g>
  ));

  const legendData = [
    { label: "Buster", color: "#ed9b40" },
    { label: "Arts", color: "#4d82db" },
    { label: "Quick", color: "#49a078" },
  ];

  const legend = legendData.map((d, index) => (
    <g key={index} transform={`translate(${chartWidth - 100}, ${index * 20})`}>
      <rect x={0} y={-10} width={10} height={10} fill={`${d.color}`} />
      <text x={15} y={0} style={{ fontSize: "15px" }}>{d.label}</text>
    </g>
  ));

  const yAxis = d3.axisLeft(yScale).ticks();

  return (
    <svg width={Width} height={Height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {data.length == 0 ? <g><text
          x={`${chartWidth / 2}`}
          y={`${chartHeight / 2}`}
          font-size="100px" 
          textAnchor='middle'>
          No Data
        </text></g> : <g>{bars}</g>}

        <g>
          <g>
            <g transform={`translate(0, ${chartHeight})`} ref={(node) => d3.select(node).call(d3.axisBottom(xScale).tickFormat("").tickSize(1) )} />
            <text
              transform={`translate(${chartWidth / 2}, ${Height - margin.bottom + 90})`}
              textAnchor="middle"
            >
              Servant
            </text>
          </g>
          <g>
            <g ref={(node) => d3.select(node).call(yAxis)} />
            <text
              transform={`translate(-50, ${chartHeight / 2}) rotate(-90)`}
              textAnchor="middle"
            >
              days
            </text>
          </g>
        </g>
        <g>{legend}</g>
      </g>
    </svg>
  );

};

export default BarChart;