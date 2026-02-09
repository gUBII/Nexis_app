import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const HashSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M11.667 15h10.666M11.667 19h10.666M15.667 11l-1.334 12M19.667 11l-1.334 12'
    />
  </Svg>
);

export default HashSvg;
