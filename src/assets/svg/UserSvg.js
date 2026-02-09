import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const UserSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' fill='none'>
    <Rect width={34} height={34} fill='#55CBF5' rx={6} />
    <Path
      stroke='#FFFFFF'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M22.333 23v-1.333A2.667 2.667 0 0 0 19.667 19h-5.334a2.667 2.667 0 0 0-2.666 2.667V23M17 16.333A2.667 2.667 0 1 0 17 11a2.667 2.667 0 0 0 0 5.333Z'
    />
  </Svg>
);

export default UserSvg;
