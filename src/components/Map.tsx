import { Tooltip } from "react-svg-tooltip";
import React from "react";

import { Mercator, Graticule } from "@visx/geo";
import * as topojson from "topojson-client";
import topology from "@/lib/topo";

export const background = "#f9f7e8";

export type GeoMercatorProps = {
  width: number;
  height: number;
  countries: any[];
};

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string };
}

const world = topojson.feature(topology, topology.objects.units) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

export default function ({ width, height, countries }: GeoMercatorProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
        rx={14}
      />
      <Mercator<FeatureShape>
        data={world.features}
        scale={scale}
        translate={[centerX, centerY + 50]}
      >
        {(mercator) => (
          <g>
            <Graticule
              graticule={(g) => mercator.path(g) || ""}
              stroke="rgba(33,33,33,0.05)"
            />
            {mercator.features.map(({ feature, path }, i) => {
              return (
                <Country
                  countries={countries}
                  feature={feature}
                  path={path}
                  key={`map-feature-${i}`}
                />
              );
            })}
          </g>
        )}
      </Mercator>
    </svg>
  );
}

const Country = ({ feature, path, countries }) => {
  const countryRef = React.createRef<SVGCircleElement>();
  return (
    <>
      <path
        ref={countryRef}
        d={path || ""}
        fill={
          countries.find((c) => c.name === feature.properties.name)
            ? "#ffa020"
            : "#858383"
        }
        stroke={background}
        strokeWidth={0.5}
      />
      <Tooltip triggerRef={countryRef}>
        <rect
          x={2}
          y={2}
          width={100}
          height={30}
          rx={4}
          ry={4}
          fill="#2a2a2a"
        />
        <text x={10} y={20} fontSize={10} fill="white">
          {feature.properties.name}
        </text>
      </Tooltip>
    </>
  );
};
