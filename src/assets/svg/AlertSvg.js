import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

const AlertSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none'>
    <Rect width={18} height={18} fill='#EC5' rx={9} />
    <G
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      clipPath='url(#a)'
    >
      <Path d='M8.288 5.608 4.758 11.5a.833.833 0 0 0 .713 1.25h7.058a.833.833 0 0 0 .713-1.25l-3.53-5.892a.833.833 0 0 0-1.424 0v0ZM9 7.75v1.667M9 11.083h.004' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M4 4h10v10H4z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default AlertSvg;
