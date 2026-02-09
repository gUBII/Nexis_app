import * as React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const SearchSvg = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 20 20" fill="none">
    <Rect width={20} height={20} fill="none" rx={6} />
    <Circle cx={9} cy={9} r={7} stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 14L17.5 17.5" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default SearchSvg;
