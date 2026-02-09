import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const PlusSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={10} height={10} fill='none'>
    <Path
      fill='#FFFFFF'
      d='M4.94 9.86a.76.76 0 0 1-.76-.76V5.62H.74a.74.74 0 0 1 0-1.48h3.44V.76a.76.76 0 1 1 1.52 0v3.38h3.44a.74.74 0 0 1 0 1.48H5.7V9.1c0 .42-.34.76-.76.76Z'
    />
  </Svg>
);

export default PlusSvg;
