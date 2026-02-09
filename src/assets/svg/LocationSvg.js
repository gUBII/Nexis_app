import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const LocationSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' fill='none'>
    <Rect width={34} height={34} fill='#55CBF5' rx={6} />
    <Path
      stroke='#FFFFFF'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M17 21.667c2.773-3.057 5-5.726 5-8.167a5 5 0 1 0-10 0c0 2.441 2.227 5.11 5 8.167Z'
    />
    <Path
      stroke='#FFFFFF'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M17 15.5a1.667 1.667 0 1 1 0-3.333 1.667 1.667 0 0 1 0 3.333Z'
    />
  </Svg>
);

export default LocationSvg;
