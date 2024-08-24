import React from 'react';
import { Alert, View } from 'react-native';
import { Camera, runAsync, runAtTargetFps, useCameraFormat, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Skia } from '@shopify/react-native-skia';
import { runOnJS } from 'react-native-reanimated';
import { worklet } from 'react-native-worklets-core';


interface FrameProcessingProps {
  device: any;
  model: any;
}

const FrameProcessing: React.FC<FrameProcessingProps> = ({ device, model  }) => {
  const { resize } = useResizePlugin();



  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    console.log('hello')
}, [])


  const format = useCameraFormat(device, [{ fps: 30 }]);
  const fps = format?.maxFps;


  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />
    </View>
  );
};

export default FrameProcessing;