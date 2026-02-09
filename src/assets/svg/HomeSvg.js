import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const HomeSvg = ({color = '#FFFFFF'}) => (
  <Svg
    width='800px'
    height='800px'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <Path d='M8 0L1 5V16H15V5L8 0Z' fill={color} />
  </Svg>
);

export default HomeSvg;
