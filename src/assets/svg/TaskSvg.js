import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const TaskSvg = ({ color = '#FFFFFF' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
    {/* Clipboard Outline */}
    <Path
      d="M7 2h10a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Clipboard Top Bar */}
    <Rect x={9} y={2} width={6} height={3} rx={1} fill={color} />

    {/* First Checkbox */}
    <Rect x={7} y={8} width={2} height={2} fill={color} />
    <Path d="M10 9l1 1 2-2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

    {/* Second Checkbox */}
    <Rect x={7} y={13} width={2} height={2} fill={color} />
    <Path d="M10 14l1 1 2-2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

    {/* Bottom Rectangle */}
    <Rect x={7} y={18} width={2} height={2} fill={color} />
  </Svg>
);

export default TaskSvg; 
