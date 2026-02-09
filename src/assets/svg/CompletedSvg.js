import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const CompletedSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={52} height={52} fill='none'>
    {/* <Path
      fill='#FDCEDF'
      fillRule='evenodd'
      d='M26 8C16.059 8 8 16.059 8 26s8.059 18 18 18 18-8.059 18-18S35.941 8 26 8ZM4 26C4 13.85 13.85 4 26 4s22 9.85 22 22-9.85 22-22 22S4 38.15 4 26Z'
      clipRule='evenodd'
    /> */}
    <Path
      fill='#fff'
      fillRule='evenodd'
      d='M26 12c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14ZM4 26C4 13.85 13.85 4 26 4s22 9.85 22 22-9.85 22-22 22S4 38.15 4 26Zm-4 0C0 11.64 11.64 0 26 0s26 11.64 26 26-11.64 26-26 26S0 40.36 0 26ZM26 8C16.059 8 8 16.059 8 26s8.059 18 18 18 18-8.059 18-18S35.941 8 26 8Z'
      clipRule='evenodd'
    />
    <Path
      fill='#FFF'
      fillRule='evenodd'
      d='M35.44 18.893a1 1 0 0 1 0 1.414L23.707 32.04a1 1 0 0 1-1.414 0l-5.334-5.333a1 1 0 0 1 1.415-1.414L23 29.919l11.026-11.026a1 1 0 0 1 1.414 0Z'
      clipRule='evenodd'
    />
  </Svg>
);

export default CompletedSvg;
