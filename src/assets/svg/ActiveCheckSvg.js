import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const ActiveCheckSvg = () => (
  <Svg width={11} height={8} fill='none' xmlns='http://www.w3.org/2000/svg'>
    <Path
      d='m9.25.75-5.5 5.5-2.5-2.5'
      stroke='#192639'
      strokeWidth={1.125}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
);

export default ActiveCheckSvg;
