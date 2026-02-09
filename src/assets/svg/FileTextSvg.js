import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const FileTextSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={18} height={16} fill='none'>
    <Path
      stroke='#6C6D84'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M10.053 1.333h-5.59c-.37 0-.725.14-.987.39s-.41.59-.41.944v10.666c0 .354.148.693.41.943s.617.39.988.39h8.384c.37 0 .726-.14.988-.39s.41-.589.41-.943v-8l-4.193-4ZM11.45 11.333H5.862M11.45 8.667H5.862M7.259 6H5.86'
    />
    <Path
      stroke='#6C6D84'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M10.053 1.333v4h4.192'
    />
  </Svg>
);

export default FileTextSvg;
