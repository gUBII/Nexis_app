import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const MoreSvg = ({color = '#FFFFFF'}) => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill='none'>
    <Path
      fill={color}
      d='M12 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
    />
  </Svg>
);

export default MoreSvg;
