import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../constants/ThemeContext';

const CreditCardSvg = () => {
  const {theme} = useTheme(); // Get the current theme from context
  return (
    <Svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <Path
        fill={theme === 'light' ? '#040325' : '#ffffff'}
        d='M20 6.367V5.313c0-1.209-.98-2.188-2.188-2.188H2.188C.98 3.125 0 4.105 0 5.313v1.054c0 .108.087.196.195.196h19.61A.195.195 0 0 0 20 6.367ZM0 8.008v6.68c0 1.208.98 2.187 2.188 2.187h15.624c1.209 0 2.188-.98 2.188-2.188v-6.68a.195.195 0 0 0-.195-.194H.195A.195.195 0 0 0 0 8.008Zm5 5.117c0 .345-.28.625-.625.625H3.75a.625.625 0 0 1-.625-.625V12.5c0-.345.28-.625.625-.625h.625c.345 0 .625.28.625.625v.625Z'
      />
    </Svg>
  );
};

export default CreditCardSvg;
