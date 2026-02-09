import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const WatchSvg = ({ color = '#FFFFFF' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    {/* Outer Circle */}
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
    
    {/* Watch Hands */}
    <Path
      fill={color}
      d="M12 7a.75.75 0 0 1 .75.75V12h3a.75.75 0 0 1 0 1.5h-3.75a.75.75 0 0 1-.75-.75V7.75A.75.75 0 0 1 12 7Z"
    />
    
    {/* Center Dot */}
    <Circle cx={12} cy={12} r={1} fill={color} />
  </Svg>
);

export default WatchSvg;
