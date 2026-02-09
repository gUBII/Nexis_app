import React from 'react';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

const ImageProgress = createImageProgress(FastImage);

import {theme} from '../../constants';

const ImageBackground = ({children, source, style, imageStyle, resizeMode}) => {
  return (
    <ImageProgress
      source={source}
      style={{...style}}
      imageStyle={{...imageStyle}}
      resizeMode={
        resizeMode === 'cover'
          ? FastImage.resizeMode.cover
          : resizeMode === 'contain'
          ? FastImage.resizeMode.contain
          : FastImage.resizeMode.stretch
      }
    >
      {children}
    </ImageProgress>
  );
};

export default ImageBackground;
