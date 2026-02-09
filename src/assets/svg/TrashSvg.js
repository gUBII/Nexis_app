import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const TrashSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M2 4.5h12M12.667 4.5v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.334 1.334 0 0 1-1.334-1.334V4.5m2 0V3.167a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4.5M9.333 7.833v4M6.667 7.833v4'
    />
  </Svg>
);

export default TrashSvg;
