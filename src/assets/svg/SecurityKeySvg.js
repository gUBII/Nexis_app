import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SecurityKeySvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <Path
      stroke='#4C4C60'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='m14 1.833-1.333 1.334M7.593 8.24l2.74-2.74m0 0 2 2 2.334-2.333-2-2M10.333 5.5l2.334-2.333M7.593 8.24a3.666 3.666 0 1 1-5.185 5.185 3.667 3.667 0 0 1 5.185-5.184V8.24Z'
    />
  </Svg>
);

export default SecurityKeySvg;
