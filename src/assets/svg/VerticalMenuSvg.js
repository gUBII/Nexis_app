import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const VerticalMenuSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <Path
      stroke='#6C6D84'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M8 13.333A.667.667 0 1 0 8 12a.667.667 0 0 0 0 1.333ZM8 8.667a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334ZM8 4a.667.667 0 1 0 0-1.333A.667.667 0 0 0 8 4Z'
    />
  </Svg>
);

export default VerticalMenuSvg;
