import { Tooltip } from "react-svg-tooltip";
import React, { useMemo, useRef } from "react";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { GradientPinkRed } from "@visx/gradient";
import { scaleLinear } from "@visx/scale";

const x = (d: number[]) => d[0];
const y = (d: number[]) => d[1];

export type DotsProps = {
  width: number;
  height: number;
  data: {
    name: string;
    rating: number;
  }[];
};

const GamesRating = ({ width, height, data }: DotsProps) => {
  if (width < 10) return null;

  return (
    <div>
      <svg width={width} height={height}>
        <GradientPinkRed id="dots-pink" />
        <rect width={width} height={height} rx={14} fill="url(#dots-pink)" />
        <Group>
          {data.map((point, i) => (
            <Game
              point={point}
              length={data.length}
              key={`point-${point[0]}-${i}`}
              i={i}
              width={width}
              height={height}
            />
          ))}
        </Group>
      </svg>
    </div>
  );
};

const Game = ({ point, length, i, width, height }) => {
  const countryRef = React.createRef<any>();
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [-0.2, 5.1],
        range: [0, width],
        clamp: true,
      }),
    [width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [30, 100],
        range: [height, 0],
        clamp: true,
      }),
    [height]
  );
  const xP = xScale(x([(i / length) * 5, point.rating, 0]));
  const yP = yScale(y([(i / length) * 5, point.rating, 0]));
  const text = `${point.name} (${point.rating})`;

  return (
    <>
      <g ref={countryRef}>
        <Circle cx={xP} cy={yP} r={10} fill={"#f6c431"} />
      </g>

      <Tooltip triggerRef={countryRef}>
        <rect
          x={2}
          y={2}
          width={text.length * 7}
          height={30}
          rx={4}
          ry={4}
          fill="#2a2a2a"
        />
        <text x={12} y={17} fontSize={10} fill="white">
          {point.name} ({point.rating})
        </text>
      </Tooltip>
    </>
  );
};

export default GamesRating;
