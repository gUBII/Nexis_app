import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

const EditSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} fill='none'>
    <Rect width={34} height={34} fill='#FFD9C3' rx={6} />
    <G clipPath='url(#a)'>
      <Path
        stroke='#FF8A71'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M20.333 11a1.884 1.884 0 0 1 3.22 1.333A1.885 1.885 0 0 1 23 13.667l-9 9-3.667 1 1-3.667 9-9Z'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M9 9h16v16H9z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default EditSvg;
