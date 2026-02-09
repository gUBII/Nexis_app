import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const GlobeSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <Path
      stroke='#4C4C60'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M8 15.167A6.667 6.667 0 1 0 8 1.833a6.667 6.667 0 0 0 0 13.334ZM1.333 8.5h13.334'
    />
    <Path
      stroke='#4C4C60'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M8 1.833A10.2 10.2 0 0 1 10.667 8.5 10.2 10.2 0 0 1 8 15.167 10.2 10.2 0 0 1 5.333 8.5 10.2 10.2 0 0 1 8 1.833v0Z'
    />
  </Svg>
);

export default GlobeSvg;
