import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const RefreshSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <G
      stroke='#4C4C60'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M.667 13.833v-4h4M15.333 3.167v4h-4' />
      <Path d='M2.34 6.5a6 6 0 0 1 9.9-2.24l3.093 2.907M.667 9.833 3.76 12.74a6 6 0 0 0 9.9-2.24' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 .5h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default RefreshSvg;
