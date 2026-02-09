import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const CalendarSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <Path
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M21.667 11.667h-9.334c-.736 0-1.333.597-1.333 1.333v9.333c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V13c0-.736-.597-1.333-1.333-1.333ZM11 15.667h12M19.667 10.333V13M14.333 10.333V13'
    />
  </Svg>
);

export default CalendarSvg;
