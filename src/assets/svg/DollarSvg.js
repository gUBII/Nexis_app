import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const DollarSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={17} fill='none'>
    <G
      stroke='#4C4C60'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M8 1.167v14.666M11.333 3.833h-5a2.333 2.333 0 1 0 0 4.667h3.334a2.333 2.333 0 0 1 0 4.667H4' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 .5h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default DollarSvg;
