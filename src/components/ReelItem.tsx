import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Search, Star, MessageSquare, ShoppingCart, Play, Pause } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ReelItem = ({ data, isPlaying, onTogglePause }) => {
  const player = useVideoPlayer(data.videoUrl, (p) => {
    p.loop = true;
    p.play();
  });

  const isScreenFocused = useIsFocused();
  const tabBarHeight = useBottomTabBarHeight(); // 👈 Obtiene la altura del tab bar
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);

  // 🔹 Controla reproducción al cambiar entre pantallas
  useEffect(() => {
    if (isScreenFocused && isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isScreenFocused, isPlaying]);

  const showButton = () => {
    setVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => setVisible(false));
    }, 2500);
  };

  useEffect(() => {
    showButton();
  }, [isPlaying]);

  const handleTogglePause = () => {
    onTogglePause();
    showButton();
  };

  const containerHeight = screenHeight - tabBarHeight; // 👈 Altura ajustada

  return (
    <TouchableWithoutFeedback onPress={handleTogglePause}>
      <View style={[styles.container, { height: containerHeight }]}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="cover"
          nativeControls={false}
        />

        <View style={styles.overlay} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>UMAI</Text>
          <Search size={24} color="white" />
        </View>

        {visible && (
          <Animated.View style={[styles.playButton, { opacity: fadeAnim }]}>
            {isPlaying ? <Pause size={50} color="white" /> : <Play size={50} color="white" />}
          </Animated.View>
        )}

        <View style={styles.rightControls}>
          <Star size={32} color="white" style={styles.iconMargin} fill="white" />
          <MessageSquare size={32} color="white" style={styles.iconMargin} />
        </View>

        <View style={styles.footer}>
          <View style={styles.mainOrderButton}>
            <Text style={styles.mainOrderText}>Pedir por</Text>
            <ShoppingCart size={20} color="white" />
          </View>

          <View style={styles.foodServiceButtons}>
            {data.foodServiceOptions.map((service) => (
              <View key={service.name} style={styles.serviceButton}>
                <Text style={[styles.serviceText, { color: service.color }]}>{service.name}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.usernameText}>{data.user}</Text>
          <Text style={styles.descriptionText}>{data.description}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: screenWidth, 
    backgroundColor: 'black', 
    justifyContent: 'flex-end' 
  },
  video: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  header: { 
    position: 'absolute', 
    top: 60, 
    left: 20, 
    right: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    zIndex: 10 
  },
  headerTitle: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  playButton: { 
    position: 'absolute', 
    alignSelf: 'center', 
    top: '45%', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderRadius: 50, 
    padding: 15, 
    zIndex: 15 
  },
  rightControls: { 
    position: 'absolute', 
    right: 15, 
    bottom: 150, // 👈 Ajustado para no estar tan cerca del tab bar
    alignItems: 'center', 
    zIndex: 5 
  },
  iconMargin: { marginBottom: 25 },
  footer: { 
    paddingHorizontal: 15, 
    paddingBottom: 20, // 👈 Agregado para dar espacio
    zIndex: 5 
  },
  usernameText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  descriptionText: { color: 'white', fontSize: 14, marginTop: 5, marginBottom: 10 },
  mainOrderButton: { 
    flexDirection: 'row', 
    backgroundColor: '#4CAF50', 
    borderRadius: 30, 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    alignSelf: 'flex-start', 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  mainOrderText: { color: 'white', fontWeight: 'bold', marginRight: 5, fontSize: 14 },
  foodServiceButtons: { flexDirection: 'row', marginBottom: 10 },
  serviceButton: { 
    backgroundColor: 'white', 
    borderRadius: 8, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    marginRight: 10 
  },
  serviceText: { fontWeight: 'bold', fontSize: 12 },
});

export default ReelItem;