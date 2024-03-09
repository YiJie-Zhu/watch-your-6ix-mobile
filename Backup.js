import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from './environments';
import Constants from 'expo-constants';
import { useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { WebView } from 'react-native-webview';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 43.469757,
  longitude: -80.540952,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ''}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'pt-BR',
        }}
      />
    </>
  );
}

const MapVideoOverlay = () => {
  return (
    <View style={styles.overlayContainer}>
      <WebView source={{ uri: 'http://192.168.40.203:5001/video_feed' }} />
    </View>
  );
};

export default function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [showWebView, setShowWebView] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const socket = io('http://192.168.40.203:5001');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('trigger_event', () => {
      console.log('Event triggered');
      // Your logic here to handle event triggering
    });

    socket.on('send_notification', (data) => {
      console.log('Notification received:', data);
      if (data.message === 'Disable Camera') {
        setShowWebView(false);
      } else {
        setShowWebView(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
      setMenuCollapsed(true); // Collapse the menu after trace route is pressed
    }
  };

  const onPlaceSelected = (details, flag) => {
    const set = flag === 'origin' ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>
      {showWebView && <MapVideoOverlay />}
      {!menuCollapsed && (
        <View style={styles.searchContainer}>
          <InputAutocomplete
            label="Origin"
            onPlaceSelected={(details) => {
              onPlaceSelected(details, 'origin');
            }}
          />
          <InputAutocomplete
            label="Destination"
            onPlaceSelected={(details) => {
              onPlaceSelected(details, 'destination');
            }}
          />
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Trace route</Text>
          </TouchableOpacity>
          {distance && duration ? (
            <View>
              <Text>Distance: {distance.toFixed(2)}</Text>
              <Text>Duration: {Math.ceil(duration)} min</Text>
            </View>
          ) : null}
        </View>
      )}
      <TouchableOpacity
        style={[styles.toggleButton, menuCollapsed && styles.toggleButtonOpen]}
        onPress={() => setMenuCollapsed(!menuCollapsed)}
      >
        <Text style={styles.toggleButtonText}>{menuCollapsed ? 'Show Menu' : 'Hide Menu'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 4,
  },
  toggleButtonOpen: {
    backgroundColor: '#bbb',
  },
  toggleButtonText: {
    textAlign: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200,
    height: 150,
    borderRadius: 5,
    backgroundColor: '#000',
    opacity: 0.8,
  },
});
