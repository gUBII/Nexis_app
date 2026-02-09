import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const ArrowCloseSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={10} height={6} fill='none'>
    <G clipPath='url(#a)'>
      <Path
        stroke='#FFF'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m.429.571 4.285 4.286L9 .571'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M10 5.857V.143H0v5.714z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default ArrowCloseSvg;
