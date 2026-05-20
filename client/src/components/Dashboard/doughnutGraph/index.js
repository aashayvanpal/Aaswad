import React from "react";
import * as d3 from "d3";

const Arc = ({ data, index, createArc, colors, format }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)} />
    <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      fill="black"
      fontSize="25"
    >
      {format(data.value)}
    </text>
  </g>
);

const Pie = props => {
  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null);

  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius*1.25)
    .outerRadius(props.outerRadius*1.25);

  const colors = d3.scaleOrdinal(d3.schemeSet3);
  const format = d3.format(".2f");
  const data = createPie(props.data);

  return (
    <svg width={props.width} height={props.height}>
      <g transform={`translate(${props.outerRadius*1.25} ${props.outerRadius*1.25})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            index={i}
            data={d}
            createArc={createArc}
            colors={colors}
            format={format}
          />
        ))}
      </g>
    </svg>
  );
};

export default Pie;
