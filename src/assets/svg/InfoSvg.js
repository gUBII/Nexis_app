import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const InfoSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <G
      stroke='#6C6D84'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334ZM8 10.667V8M8 5.333h.007' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default InfoSvg;
