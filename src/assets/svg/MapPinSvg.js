import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

const MapPinSvg = (props) => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <G
      stroke='#FF8A71'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M23 15.167c0 4.666-6 8.666-6 8.666s-6-4-6-8.666a6 6 0 1 1 12 0Z' />
      <Path d='M17 17.167a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M9 8.5h16v16H9z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MapPinSvg;
