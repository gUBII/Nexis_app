import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

const CompletedNoticeSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none'>
    <Rect width={18} height={18} fill='#55ACEE' rx={9} />
    <G clipPath='url(#a)'>
      <Path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12.2 6.6 7.8 11l-2-2'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M4.8 6h8.4v6H4.8z' />
      </ClipPath>
    </Defs>
  </Svg>
);
export default CompletedNoticeSvg;
