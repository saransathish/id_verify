import React from 'react';
import 'react-native-reanimated'
import { StyleSheet, Text, View } from 'react-native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import FrameProcessing from './components/FrameProcessing';

function App(): React.JSX.Element {
  // const { status, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  // console.log(JSON.stringify(device, (k, v) => k === "formats" ? [] : v, 2))
  const objectDetection = useTensorflowModel(require('./src/assets/my-modal.tflite'));
  const model = objectDetection.state === 'loaded' ? objectDetection.model : undefined;


  // require('@tensorflow/tfjs-backend-cpu');
  // require('@tensorflow/tfjs-backend-webgl');
  // const cocoSsd = require('@tensorflow-models/coco-ssd');
  // const model1  = cocoSsd.load();


  // Request camera permission if not already granted
  // if (status === 'not-determined') {
  //   requestPermission();
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text>Requesting Camera Permission...</Text>
  //     </View>
  //   );
  // }

  // Handle loading states
  if ( !device || !model) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
    
  }

  return (
    <View style={{ flex: 1 }}>
      <FrameProcessing device={device} model={model}  />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
