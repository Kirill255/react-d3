import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 650;

class Chart extends Component {
  state = {
    slices: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const radiusScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
      .range([0, width / 2]);

    const colorsScale = d3
      .scaleSequential()
      .domain(d3.extent(data, (d) => d.avg))
      .interpolator(d3.interpolateSpectral);

    const arcGenerator = d3.arc();
    const perSliceAngle = (2 * Math.PI) / data.length;

    const slices = data.map((d, i) => {
      return {
        path: arcGenerator({
          startAngle: i * perSliceAngle,
          endAngle: (i + 1) * perSliceAngle,
          innerRadius: radiusScale(d.low),
          outerRadius: radiusScale(d.high)
        }),
        fill: colorsScale(d.avg)
      };
    });

    return { slices };
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.slices.map((d, i) => (
            <path key={i} d={d.path} fill={d.fill} />
          ))}
        </g>
      </svg>
    );
  }
}

export default Chart;
