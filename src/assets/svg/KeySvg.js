import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const KeySvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' fill='none'>
    <Rect width={34} height={34} fill='#1EA8E7' rx={6} />
    <Path
      stroke='#ffffff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='m23 10.333-1.333 1.334m0 0 2 2L21.333 16l-2-2m2.334-2.333L19.333 14m-2.74 2.74a3.666 3.666 0 1 1-5.185 5.185 3.666 3.666 0 0 1 5.185-5.184v-.001Zm0 0 2.74-2.74'
    />
  </Svg>
);

export default KeySvg;
