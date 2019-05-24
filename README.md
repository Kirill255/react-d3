# D3 for React Developers

https://coursehunters.net/course/vizualizaciya-dannyh-dlya-react-razrabotchikov

https://slides.com/shirleywu/deck-11#/

https://observablehq.com/@sxywu/data-visualization-for-react-developers-starter

https://observablehq.com/@sxywu/data-visualization-for-react-developers-full

https://github.com/sxywu/react-d3-example

## Other

https://observablehq.com

https://bl.ocks.org

https://blockbuilder.org

https://github.com/square/crossfilter

https://github.com/crossfilter/crossfilter

https://github.com/hshoff/vx

https://github.com/emeeks/semiotic

https://github.com/nteract/semiotic

https://github.com/susielu/d3-legend

https://github.com/susielu/d3-annotation

https://github.com/susielu/react-annotation

**Tips:**

1. For example, we have a link `http://bl.ocks.org/d3noob/8952219`. We can change part of the URL `bl.ocks` to `blockbuilder`, to make the output `http://blockbuilder.org/d3noob/8952219` and then we can edit the example code.

2. **Never ever let D3 and React manage same parts of the DOM! OR BUGS!!**

3. Transitions:

   **In componentDidUpdate:**

- Select elements to transition
- Bind data
- Call transition
- Set the attributes to transition

* **Make sure React doesn't manage the attributes D3 is transitioning!**

```jsx
// in componentDidUpdate
d3.select(this.refs.bars)
  .selectAll("rect")
  .data(this.state.bars)
  .transition()
  .attr("y", (d) => d.y) // manage D3
  .attr("height", (d) => d.height) // manage D3
  .attr("fill", (d) => d.fill); // manage D3

// in render {/* manage React */}
<g ref="bars">
  {this.state.bars.map((d, i) => (
    <rect key={i} x={d.x} width="2" />
  ))}
</g>;
```
