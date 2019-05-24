import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class BarChartBrush extends Component {
  state = {
    bars: []
  };

  xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%b"));
  yAxis = d3.axisLeft().tickFormat((d) => `${d}℉`);

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, range } = nextProps;
    if (!data) return {};

    const extent = d3.extent(data, (d) => d.date);
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    const [min, max] = d3.extent(data, (d) => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    const colorExtent = d3.extent(data, (d) => d.avg).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);

    const bars = data.map((d) => {
      const isColored = !range.length || (range[0] <= d.date && d.date <= range[1]); // slice should be colored if there's no time range or if the slice is within the time range

      return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: isColored ? colorScale(d.avg) : "#ccc"
      };
    });

    return { bars, xScale, yScale };
  }

  componentDidMount() {
    // Step 1: Create brush instance
    this.brush = d3
      .brushX() // try brush(), although the logic will not work correctly(need to rewrite code), you will still see the main idea
      .extent([
        [margin.left, margin.top], // left-top corner
        [width - margin.right, height - margin.bottom] // right-bottom corner
      ])
      .on("end", this.brushEnd);

    // Step 3: Call brush on the brush element
    d3.select(this.refs.brush).call(this.brush);
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  brushEnd = () => {
    // console.log(d3.event.selection);
    if (!d3.event.selection) {
      this.props.updateRange([]);
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)]; // invert -> compute the domain value corresponding to a given range value.
    // console.log(range); // [Fri Mar 03 2017 11:14:39 GMT+0300 (Москва, стандартное время), Tue May 30 2017 18:47:53 GMT+0300 (Москва, стандартное время)]

    this.props.updateRange(range);
  };

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={2} height={d.height} fill={d.fill} />
        ))}

        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />

        {/* Step 2: Create an SVG brush element */}
        <g ref="brush" />
      </svg>
    );
  }
}

export default BarChartBrush;

/*
1. Create brush instance in componentDidMount, Define brushable area (extent), Pass in a function to execute on every brush, or brush end
this.brush = d3.brush()
  .extent([[0, 0], [width ,height]])
  .on('end', () => ...);

2. Create an SVG brush element in render
<g ref='brush' />

3. Call brush on the brush element in componentDidMount
d3.select(this.refs.brush)
  .call(this.brush);
*/
