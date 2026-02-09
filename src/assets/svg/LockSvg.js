import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const LockSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M12.667 7.833H3.333C2.597 7.833 2 8.43 2 9.167v4.666c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V9.167c0-.737-.597-1.334-1.333-1.334ZM4.667 7.833V5.167a3.333 3.333 0 1 1 6.666 0v2.666'
    />
  </Svg>
);

export default LockSvg;
