import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DocumentSvg = ({ color = '#FFFFFF' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    {/* File Shape with Folded Corner */}
    <Path
      fill={color}
      d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8.5a2 2 0 0 0-.59-1.41l-4.5-4.5A2 2 0 0 0 13.5 2H6Zm7.5 1.5L18 8h-4.5V3.5ZM6 4h6v5c0 .55.45 1 1 1h5v10H6V4Zm2 9a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 13Zm0 3a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 16Z"
    />
  </Svg>
);

export default DocumentSvg;
