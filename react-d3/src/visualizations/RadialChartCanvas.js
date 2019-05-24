import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 650;

class RadialChartCanvas extends Component {
  state = {
    slices: []
  };

  arcGenerator = d3.arc();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {}; // or return null

    const radiusScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]) // [Math.min(0, d3.min(data, (d) => d.low)), d3.max(data, (d) => d.high)]
      .range([0, width / 2]);

    const colorScale = d3
      .scaleSequential()
      .domain(d3.extent(data, (d) => d.avg))
      .interpolator(d3.interpolateRdYlBu);

    const perSliceAngle = (2 * Math.PI) / data.length;

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const slices = data.map((d, i) => {
      const arcData = {
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high)
      };

      return { arcData, fill: colorScale(d.avg) };
    });

    return { slices };
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");
    // and translate it so that the slices are centered
    this.ctx.translate(width / 2, height / 2);
    // set ctx on arc generator
    this.arcGenerator.context(this.ctx);

    this.drawSlices();
  }

  componentDidUpdate() {
    this.drawSlices();
  }

  drawSlices() {
    this.state.slices.forEach((slice) => {
      this.ctx.fillStyle = slice.fill;
      this.ctx.beginPath();
      this.arcGenerator(slice.arcData);
      this.ctx.fill();
    });
  }

  render() {
    return <canvas ref="canvas" width={width} height={height} />;
  }
}

export default RadialChartCanvas;
