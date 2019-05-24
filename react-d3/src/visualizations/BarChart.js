import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class BarChart extends Component {
  state = {
    bars: []
  };

  // Step 1: create axisLeft or axisBottom at beginning of React lifecycle
  xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%b"));
  yAxis = d3.axisLeft().tickFormat((d) => `${d}℉`);

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};
    // 1. map date to x-position
    // get min and max of date
    const extent = d3.extent(data, (d) => d.date);
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    // 2. map high temp to y-position
    // get min/max of high temp
    const [min, max] = d3.extent(data, (d) => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    // 3. map avg temp to color
    // get min/max of avg
    const colorExtent = d3.extent(data, (d) => d.avg).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);

    // array of objects: x, y, height
    const bars = data.map((d) => {
      return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: colorScale(d.avg)
      };
    });

    // we must to return xScale and yScale too, because we need access to them in another place, in componentDidUpdate
    return { bars, xScale, yScale };
  }

  componentDidUpdate() {
    // Step 3: call axis on the group element in componentDidUpdate
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={2} height={d.height} fill={d.fill} />
        ))}

        {/* Step 2: create an SVG group element in render */}
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default BarChart;

/*
1. Create axisLeft or axisBottom at beginning of React lifecycle and set corresponding scale
const yAxis = d3.axisLeft().scale(yScale);

2. Create an SVG group element in render
<g ref='group' />

3. Call axis on the group element in componentDidUpdate
d3.select(this.refs.group).call(yAxis);
*/
