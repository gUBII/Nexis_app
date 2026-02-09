import * as React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const ChatbotSvg = ({ style = {} }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={65} height={65} viewBox="0 0 30 30" fill="none"  style={style}>
    {/* Head Shape */}
    <Path 
      d="M15 2.5C20.625 2.5 25 6.875 25 12.5C25 18.125 20.625 22.5 15 22.5C9.375 22.5 5 18.125 5 12.5C5 6.875 9.375 2.5 15 2.5Z"
      fill="#1E50B4"
      stroke="#1E50B4"
      strokeWidth={1.5}
    />
    {/* Face (White Oval) */}
    <Ellipse 
      cx="15" cy="12.5" rx="7.5" ry="5.625"
      fill="white"
    />
    {/* Eyes */}
    <Circle cx="12.5" cy="12.5" r="1.9" fill="black" />
    <Circle cx="18.5" cy="12.5" r="1.9" fill="black" />
  </Svg>
);

export default ChatbotSvg;
