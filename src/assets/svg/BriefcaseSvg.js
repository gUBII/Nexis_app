import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const BriefcaseSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M22.333 13.667H11.667c-.737 0-1.334.597-1.334 1.333v6.667c0 .736.597 1.333 1.334 1.333h10.666c.737 0 1.334-.597 1.334-1.333V15c0-.736-.597-1.333-1.334-1.333Z'
    />
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M19.667 23V12.333A1.334 1.334 0 0 0 18.333 11h-2.666a1.333 1.333 0 0 0-1.334 1.333V23'
    />
  </Svg>
);

export default BriefcaseSvg;
