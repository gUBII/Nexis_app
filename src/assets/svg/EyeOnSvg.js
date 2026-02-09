import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const EyeOnSvg = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
    <G
      stroke="#6C6D84"
      strokeLinecap="round"
      strokeLinejoin="round"
      clipPath="url(#a)"
    >
      {/* Eye shape */}
      <Path d="M8 13.333C3.333 13.333.667 8 .667 8S3.333 2.667 8 2.667c4.667 0 7.333 5.333 7.333 5.333s-2.667 5.333-7.333 5.333Z" />
      {/* Pupil */}
      <Path d="M8 10.667a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default EyeOnSvg;
