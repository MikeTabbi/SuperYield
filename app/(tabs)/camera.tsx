import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function PlantScannerCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);

  // Automatically request permission on load if not granted
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    // Simulate a scan (replace with camera capture logic if needed)
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert('Scan Complete', 'Plant scan completed successfully!');
    }, 2000);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.grantText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() =>
              setFacing((current) => (current === 'back' ? 'front' : 'back'))
            }
          >
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  flipButton: {
    alignSelf: 'flex-end',
    marginTop: 40,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grantText: {
    marginTop: 10,
    color: 'blue',
    fontWeight: 'bold',
  },
});
