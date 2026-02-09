import * as React from 'react';
import Svg, { Rect, Path, Line } from 'react-native-svg';

const FlagSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' fill='none'>
    <Rect width={34} height={34} fill='#55CBF5' rx={6} />
    <Path
      stroke='#FFFFFF'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M13 23.333V11.667M13 11.667h7.333a1.333 1.333 0 0 1 1.334 1.333v2.667a1.333 1.333 0 0 1-1.334 1.333H13'
    />
    <Line
      x1={13}
      y1={23.333}
      x2={13}
      y2={23.333}
      stroke='#FFFFFF'
      strokeWidth={1.2}
      strokeLinecap='round'
    />
  </Svg>
);

export default FlagSvg;
