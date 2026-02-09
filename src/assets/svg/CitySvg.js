import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const CitySvg = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none">
    <Rect width={34} height={34} fill="#55CBF5" rx={6} />
    <Path
      stroke="#FFFFFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12 23.333V15.667c0-.734.6-1.333 1.333-1.333H14c.734 0 1.333.6 1.333 1.333v7.666M20 23.333v-4.666c0-.734.6-1.334 1.333-1.334H22c.734 0 1.333.6 1.333 1.334v4.666M14 20.333h-1.333v3H14v-3ZM22 20.333h-1.333v3H22v-3ZM18 23.333V11.667c0-.734-.6-1.334-1.333-1.334H16c-.734 0-1.333.6-1.333 1.334v11.666M18 14h-1.333v2H18v-2Z"
    />
  </Svg>
);

export default CitySvg;
