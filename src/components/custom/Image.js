import React from 'react';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

const ImageProgress = createImageProgress(FastImage);

const Image = ({source, style, imageStyle, resizeMode, tintColor}) => {
  return (
    <ImageProgress
      style={{...style}}
      source={source}
      imageStyle={{...imageStyle}}
      resizeMode={
        resizeMode === 'cover'
          ? FastImage.resizeMode.cover
          : resizeMode === 'contain'
          ? FastImage.resizeMode.contain
          : FastImage.resizeMode.stretch
      }
      tintColor={tintColor}
    />
  );
};

export default Image;
