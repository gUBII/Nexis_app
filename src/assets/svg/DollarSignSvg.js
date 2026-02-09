import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

const DollarSignSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <G
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M17 9.667v14.666M20.333 12.333h-5a2.333 2.333 0 1 0 0 4.667h3.334a2.333 2.333 0 0 1 0 4.667H13' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M9 9h16v16H9z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default DollarSignSvg;
