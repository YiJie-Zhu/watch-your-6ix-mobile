// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, View  } from 'react-native';
// import { WebView } from 'react-native-webview';


// import { Video } from 'expo-av';


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   overlayContainer: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     width: 200,
//     height: 150,
//     borderRadius: 5,
//     backgroundColor: '#000',
//     opacity: .8,
//    },
//    videoPlayer:{
//      flex :1 ,
//      width:'100%',
//      height:'100%'
//    }
// });

// const MapVideoOverlay = () => {
//   return (
//     <View style={styles.overlayContainer}>
//       {/* <Video 
//         source={{ uri: '<video_url>' }}
//         rate={1.0}
//         volume={1.0}
//         isMuted={false}
//         resizeMode="cover"
//         shouldPlay
//         isLooping
//         style={styles.videoPlayer}
//       /> */}
//       <WebView source={{ uri:'http://192.168.40.203:5001/video_feed'}} />
//     </View>
    
//   );
// };

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} />
//       <MapVideoOverlay />
//     </View>
//   );
// }