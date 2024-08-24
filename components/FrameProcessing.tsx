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
    if (model == null) return


    // runOnJS(console.log)('hii')

    // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
    const resized = resize(frame, {
        scale: {
          width: 192,
          height: 192,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
    })

    // 2. Run model with given input buffer synchronously
    const outputs = model.runSync([resized])
    // 3. Interpret outputs accordingly
    const detection_boxes = outputs[0]
    const detection_classes = outputs[1]
    const detection_scores = outputs[2]
    const num_detections = outputs[3]

    console.log('num_detections' , num_detections);
    console.log('detection_scores',detection_scores);
    console.log('detection_classes',detection_classes)
    console.log('outputs',outputs)

    for (let i = 0; i < detection_boxes.length; i += 4) {
      console.log(detection_boxes[i])
        const confidence = detection_scores[i / 4]
        if (confidence > 0.1) {
            // 4. Draw a red box around the detected object!
            const left = detection_boxes[i]
            const top = detection_boxes[i + 1]
            const right = detection_boxes[i + 2]
            const bottom = detection_boxes[i + 3]
            const paint = Skia.Paint()
            paint.setColor(Skia.Color('red'))
            // frame.drawRect(detection_boxes[i].rect,paint)
        }
    }
    // console.log( model.detect(frame) )
    // runOnJS(model.detect)(frame)
    console.log(frame)
    // frame.render()
    
}, [model])

const frameProcessor1 = useFrameProcessor((frame) => {
  'worklet'

  const centerX = frame.width / 2
  const centerY = frame.height / 2
  const rect = Skia.XYWHRect(centerX, centerY, 150, 150)
  const paint = Skia.Paint()
  paint.setColor(Skia.Color('red'))
  // frame.drawRect(rect, paint)
  // frame.render()

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