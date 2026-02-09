import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const RejectedSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none'>
    <Rect width={18} height={18} fill='#FF8A71' rx={9} />
    <Path
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m11.5 6.5-5 5M6.5 6.5l5 5'
    />
  </Svg>
);

export default RejectedSvg;
