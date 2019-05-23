import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;

class BChart extends Component {
  state = {
    bars: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const extentDate = d3.extent(data, (d) => d.date);
    const [min, max] = d3.extent(data, (d) => d.high);
    const extentAvg = d3.extent(data, (d) => d.avg).reverse();

    const xScale = d3
      .scaleTime()
      .domain(extentDate)
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height, 0]);

    const colorsScale = d3
      .scaleSequential()
      .domain(extentAvg)
      .interpolator(d3.interpolateRdYlBu);

    const bars = data.map((d) => {
      return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: colorsScale(d.avg)
      };
    });

    return { bars };
  }

  render() {
    // console.log(this.state);
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={2} height={d.height} fill={d.fill} />
        ))}
      </svg>
    );
  }
}

export default BChart;
