import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class BarChartCanvas extends Component {
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
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

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

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");
    this.drawBars();
  }

  componentDidUpdate() {
    this.drawBars();
  }

  drawBars() {
    this.state.bars.forEach((bar) => {
      this.ctx.fillStyle = bar.fill;
      this.ctx.fillRect(bar.x, bar.y, 2, bar.height);
    });
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    );
  }
}

export default BarChartCanvas;
