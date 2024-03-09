import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import io from 'socket.io-client';
import Geolocation from '@react-native-community/geolocation';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200,
    height: 150,
    borderRadius: 5,
    backgroundColor: '#000',
    opacity: .8,
  },
  videoPlayer: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

const MapVideoOverlay = () => {
  return (
    <View style={styles.overlayContainer}>
      <WebView source={{ uri: 'http://192.168.40.203:5001/video_feed' }} />
    </View>
  );
};

export default function App() {
  const [showWebView, setShowWebView] = useState(true);

  useEffect(() => {
    const socket = io('http://192.168.40.203:5001');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('trigger_event', () => {
      console.log('Event triggered');
      // if (showWebView == true) {
      //   setShowWebView(false);
      // }
      // else {
      //   setShowWebView(true);
      // } // Update showWebView when event is triggered
    });

    socket.on('send_notification', (data) => {
      console.log('Notification received:', data);
      if (data.message == "Disable Camera") {
        setShowWebView(false);
      }
      else {
        setShowWebView(true);
      }
      // setShowWebView(data.message !== 'Default Notification');
    });
    
    socket.on('request_speed', () => {
      handleSendSpeed();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  
  const handleSendSpeed = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        socket.emit('speed_data', position.coords.speed);
      },
      error => Alert.alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      {showWebView && <MapVideoOverlay />}
    </View>
  );
}
