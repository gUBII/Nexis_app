import * as React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const FlagMarkSvg = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 20 20" fill="none">
    <Rect width={20} height={20} fill="none" rx={6} />
    <Path d="M5 2L5 18" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5.66247 11.3028C10.2653 11.6821 12.4435 10.385 15.9476 7.78647C16.3176 7.51206 16.5027 7.37485 16.5037 7.25035C16.5042 7.19788 16.4889 7.14858 16.459 7.1055C16.3879 7.00327 16.1541 6.9941 15.6864 6.97577C11.5401 6.81327 9.25533 5.81079 5.9821 3.29429C5.7148 3.08878 5.58115 2.98603 5.47206 3.00581C5.42575 3.01421 5.38373 3.03491 5.34884 3.0665C5.26667 3.14093 5.26667 3.30799 5.26667 3.6421L5.26667 7L5.26667 10.8707C5.26667 11.0313 5.26667 11.1116 5.30462 11.1724C5.3209 11.1984 5.34264 11.222 5.36728 11.2404C5.42473 11.2832 5.50398 11.2898 5.66247 11.3028Z" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default FlagMarkSvg;
