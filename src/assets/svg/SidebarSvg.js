import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../constants/ThemeContext';

const SidebarSvg = () => {
  const {theme} = useTheme();
  return (
    <Svg xmlns='http://www.w3.org/2000/svg' width={240} height={22} fill='none'>
      <Path
        fill={theme === 'light' ? '#040325' : '#ffffff'}
        d='M12 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
      />
    </Svg>
  );
};

export default SidebarSvg;
