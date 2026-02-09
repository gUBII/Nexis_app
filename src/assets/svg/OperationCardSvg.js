import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const OperationCardSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} fill='none'>
    <Rect width={30} height={30} fill='#fff' rx={15} />
    <Path
      stroke='#040325'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M17 9.667h4c.736 0 1.333.597 1.333 1.333v8c0 .736-.596 1.333-1.333 1.333H9A1.333 1.333 0 0 1 7.667 19v-8c0-.736.597-1.333 1.333-1.333h4M7.667 13.667H13m9.333 0H17'
    />
    <Path
      fill='#040325'
      d='M15.6 8a.6.6 0 1 0-1.2 0h1.2Zm-1.024 11.424a.6.6 0 0 0 .848 0l3.819-3.818a.6.6 0 1 0-.849-.849L15 18.151l-3.394-3.394a.6.6 0 1 0-.849.849l3.819 3.818ZM14.4 8v11h1.2V8h-1.2Z'
    />
  </Svg>
);

export default OperationCardSvg;
