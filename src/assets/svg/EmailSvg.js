import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const EmailSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#1EA8E7' rx={6} />
    <Path
      stroke='#ffffff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M11.667 11.667h10.666c.734 0 1.334.6 1.334 1.333v8c0 .733-.6 1.333-1.334 1.333H11.667c-.734 0-1.334-.6-1.334-1.333v-8c0-.733.6-1.333 1.334-1.333Z'
    />
    <Path
      stroke='#ffffff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M23.667 13 17 17.667 10.333 13'
    />
  </Svg>
);

export default EmailSvg;
